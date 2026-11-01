import crypto from "crypto";
import httpStatus from "http-status";
import { PipelineStage, Types } from "mongoose";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { AnalyticsRange, IPageView } from "./analytics.interface";
import { PageView } from "./analytics.model";

/** Reports are in the owner's local time. */
export const ANALYTICS_TZ = "Asia/Dhaka";
const TZ_OFFSET_MS = 6 * 60 * 60 * 1000; // Asia/Dhaka is UTC+6, no DST

const dhakaDay = (d: Date) => new Date(d.getTime() + TZ_OFFSET_MS).toISOString().slice(0, 10);

/**
 * Salted, daily-rotating visitor hash. The salt is derived from a server
 * secret, so the hash can't be reversed to an IP by brute force, and the date
 * in it means the same person is a different "visitor" tomorrow.
 */
export const visitorHash = (ip: string, ua: string, now = new Date()) => {
  const secret = process.env.ANALYTICS_SALT || config.jwt.secret || "portfolio-analytics";
  return crypto
    .createHmac("sha256", String(secret))
    .update(`${dhakaDay(now)}|${ip}|${ua}`)
    .digest("hex")
    .slice(0, 24);
};

const create = async (data: Omit<IPageView, "_id" | "createdAt">) => {
  const doc = await PageView.create(data);
  return { id: String(doc._id) };
};

/** Time on page, sent when the visitor leaves. Only the same session may set it. */
const setDuration = async (id: string, sessionId: string, seconds: number) => {
  if (!Types.ObjectId.isValid(id)) return;
  const capped = Math.max(0, Math.min(Math.round(seconds), 30 * 60));
  await PageView.updateOne({ _id: id, sessionId }, { $max: { duration: capped } });
};

/** Start of the range and of the period before it (for % change). */
const rangeBounds = (range: AnalyticsRange, now = new Date()) => {
  const todayStart = new Date(Date.parse(`${dhakaDay(now)}T00:00:00.000Z`) - TZ_OFFSET_MS);
  const days = range === "today" ? 1 : Number(range.replace("d", ""));
  const from = new Date(todayStart.getTime() - (days - 1) * 86_400_000);
  const prevFrom = new Date(from.getTime() - days * 86_400_000);
  return { from, prevFrom, days };
};

const top = (field: string, limit = 8, extra: Record<string, unknown> = {}): PipelineStage.FacetPipelineStage[] => [
  { $group: { _id: `$${field}`, views: { $sum: 1 }, visitors: { $addToSet: "$visitorHash" }, ...extra } },
  { $project: { _id: 0, key: "$_id", views: 1, visitors: { $size: "$visitors" } } },
  { $sort: { views: -1 } },
  { $limit: limit },
];

const totalsStages: PipelineStage.FacetPipelineStage[] = [
  {
    $group: {
      _id: null,
      views: { $sum: 1 },
      visitors: { $addToSet: "$visitorHash" },
      sessions: { $addToSet: "$sessionId" },
      durTotal: { $sum: "$duration" },
      durCount: { $sum: { $cond: [{ $gt: ["$duration", 0] }, 1, 0] } },
    },
  },
  {
    $project: {
      _id: 0,
      views: 1,
      visitors: { $size: "$visitors" },
      sessions: { $size: "$sessions" },
      avgDuration: { $cond: [{ $gt: ["$durCount", 0] }, { $divide: ["$durTotal", "$durCount"] }, 0] },
    },
  },
];

const bounceStages: PipelineStage.FacetPipelineStage[] = [
  { $group: { _id: "$sessionId", n: { $sum: 1 } } },
  { $group: { _id: null, sessions: { $sum: 1 }, bounced: { $sum: { $cond: [{ $eq: ["$n", 1] }, 1, 0] } } } },
  { $project: { _id: 0, rate: { $cond: [{ $gt: ["$sessions", 0] }, { $divide: ["$bounced", "$sessions"] }, 0] } } },
];

type Totals = { views: number; visitors: number; sessions: number; avgDuration: number; bounceRate: number };

const readTotals = async (from: Date, to: Date): Promise<Totals> => {
  const [res] = await PageView.aggregate([
    { $match: { createdAt: { $gte: from, $lt: to } } },
    { $facet: { totals: totalsStages, bounce: bounceStages } },
  ]);
  const t = res?.totals?.[0] ?? { views: 0, visitors: 0, sessions: 0, avgDuration: 0 };
  return { ...t, bounceRate: res?.bounce?.[0]?.rate ?? 0 };
};

const summary = async (range: AnalyticsRange = "7d") => {
  const now = new Date();
  const { from, prevFrom, days } = rangeBounds(range, now);
  const hourly = range === "today";

  const [facets] = await PageView.aggregate([
    { $match: { createdAt: { $gte: from, $lte: now } } },
    {
      $facet: {
        series: [
          {
            $group: {
              _id: hourly
                ? { $hour: { date: "$createdAt", timezone: ANALYTICS_TZ } }
                : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: ANALYTICS_TZ } },
              views: { $sum: 1 },
              visitors: { $addToSet: "$visitorHash" },
            },
          },
          { $project: { _id: 0, key: "$_id", views: 1, visitors: { $size: "$visitors" } } },
        ],
        hours: [
          { $group: { _id: { $hour: { date: "$createdAt", timezone: ANALYTICS_TZ } }, views: { $sum: 1 } } },
          { $project: { _id: 0, hour: "$_id", views: 1 } },
        ],
        weekdays: [
          { $group: { _id: { $isoDayOfWeek: { date: "$createdAt", timezone: ANALYTICS_TZ } }, views: { $sum: 1 } } },
          { $project: { _id: 0, day: "$_id", views: 1 } },
        ],
        pages: [
          { $group: { _id: "$path", views: { $sum: 1 }, visitors: { $addToSet: "$visitorHash" }, durTotal: { $sum: "$duration" }, durCount: { $sum: { $cond: [{ $gt: ["$duration", 0] }, 1, 0] } }, title: { $last: "$title" } } },
          { $project: { _id: 0, key: "$_id", title: 1, views: 1, visitors: { $size: "$visitors" }, avgDuration: { $cond: [{ $gt: ["$durCount", 0] }, { $divide: ["$durTotal", "$durCount"] }, 0] } } },
          { $sort: { views: -1 } },
          { $limit: 10 },
        ],
        places: [
          { $match: { placeId: { $ne: null } } },
          ...top("placeId", 8),
          { $lookup: { from: "travelPlaces", localField: "key", foreignField: "_id", as: "place" } },
          { $project: { key: 1, views: 1, visitors: 1, name: { $first: "$place.name" } } },
        ],
        referrers: top("referrerHost", 8),
        utm: [{ $match: { utmSource: { $ne: null } } }, ...top("utmSource", 6)],
        countries: top("country", 10),
        cities: [
          { $match: { city: { $ne: null } } },
          { $group: { _id: { city: "$city", country: "$country" }, views: { $sum: 1 }, visitors: { $addToSet: "$visitorHash" } } },
          { $project: { _id: 0, key: { $concat: ["$_id.city", ", ", { $ifNull: ["$_id.country", "?"] }] }, views: 1, visitors: { $size: "$visitors" } } },
          { $sort: { views: -1 } },
          { $limit: 8 },
        ],
        devices: top("device", 3),
        browsers: top("browser", 6),
        os: top("os", 6),
        languages: top("language", 6),
        screens: top("screen", 6),
        returning: top("returning", 2),
      },
    },
  ]);

  const [current, previous] = await Promise.all([
    readTotals(from, new Date(now.getTime() + 1)),
    readTotals(prevFrom, from),
  ]);

  // Fill gaps so the chart has every day / hour, including empty ones.
  const byKey = new Map<string | number, { views: number; visitors: number }>(
    (facets?.series ?? []).map((r: { key: string | number; views: number; visitors: number }) => [r.key, r])
  );
  const series = hourly
    ? Array.from({ length: 24 }, (_, h) => ({ key: `${String(h).padStart(2, "0")}:00`, views: byKey.get(h)?.views ?? 0, visitors: byKey.get(h)?.visitors ?? 0 }))
    : Array.from({ length: days }, (_, i) => {
        const key = dhakaDay(new Date(from.getTime() + i * 86_400_000));
        return { key, views: byKey.get(key)?.views ?? 0, visitors: byKey.get(key)?.visitors ?? 0 };
      });

  const hours = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    views: (facets?.hours ?? []).find((r: { hour: number }) => r.hour === h)?.views ?? 0,
  }));
  const weekdays = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    views: (facets?.weekdays ?? []).find((r: { day: number }) => r.day === i + 1)?.views ?? 0,
  }));

  return {
    range,
    from,
    to: now,
    timezone: ANALYTICS_TZ,
    totals: current,
    previous,
    series,
    hours,
    weekdays,
    pages: facets?.pages ?? [],
    places: facets?.places ?? [],
    referrers: facets?.referrers ?? [],
    utm: facets?.utm ?? [],
    countries: facets?.countries ?? [],
    cities: facets?.cities ?? [],
    devices: facets?.devices ?? [],
    browsers: facets?.browsers ?? [],
    os: facets?.os ?? [],
    languages: facets?.languages ?? [],
    screens: facets?.screens ?? [],
    returning: facets?.returning ?? [],
  };
};

/** Who is on the site right now, and the latest page views. */
const live = async () => {
  const since = new Date(Date.now() - 5 * 60 * 1000);
  const [active, recent] = await Promise.all([
    PageView.distinct("sessionId", { createdAt: { $gte: since } }),
    PageView.find({}, { sessionId: 1, path: 1, title: 1, country: 1, city: 1, device: 1, browser: 1, os: 1, referrerHost: 1, createdAt: 1, duration: 1, returning: 1 })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
  ]);
  return { activeVisitors: active.length, recent };
};

/** Every page a single session viewed, in order - "the visitor's journey". */
const session = async (sessionId: string) => {
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(sessionId)) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid session id");
  return PageView.find({ sessionId }, { path: 1, title: 1, duration: 1, createdAt: 1 }).sort({ createdAt: 1 }).limit(100).lean();
};

export const AnalyticsService = { create, setDuration, summary, live, session };
