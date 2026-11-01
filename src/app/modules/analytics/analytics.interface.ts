import { Model, Types } from "mongoose";

export type DeviceType = "desktop" | "mobile" | "tablet";

/**
 * One public page view. Privacy by design: no raw IP is ever stored.
 * `visitorHash` is a salted hash of IP + user agent that rotates daily, so it
 * counts unique visitors per day but cannot follow anyone across days.
 */
export type IPageView = {
  _id?: Types.ObjectId;
  path: string;
  title?: string;
  /** Travel place id when the page is /travel/:id. */
  placeId?: Types.ObjectId | null;
  referrerHost?: string | null;
  referrerPath?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  device: DeviceType;
  browser: string;
  os: string;
  screen?: string | null;
  language?: string | null;
  timezone?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  /** Random per-tab id from sessionStorage - groups a visit's page views. */
  sessionId: string;
  visitorHash: string;
  /** The browser has visited before (a plain flag, not an identifier). */
  returning: boolean;
  /** Seconds the page was visible, reported when the visitor leaves it. */
  duration: number;
  createdAt?: Date;
};

export type PageViewModel = Model<IPageView, Record<string, unknown>>;

export type AnalyticsRange = "today" | "7d" | "30d" | "90d";
