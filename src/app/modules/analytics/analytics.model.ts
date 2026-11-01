import { Schema, model } from "mongoose";
import { IPageView, PageViewModel } from "./analytics.interface";

/** Raw page views are kept for ~13 months, then MongoDB deletes them (TTL). */
export const PAGE_VIEW_TTL_SECONDS = 400 * 24 * 60 * 60;

const pageViewSchema = new Schema<IPageView, PageViewModel>(
  {
    path: { type: String, required: true, maxlength: 300 },
    title: { type: String, maxlength: 200 },
    placeId: { type: Schema.Types.ObjectId, ref: "TravelPlace", default: null },
    referrerHost: { type: String, default: null },
    referrerPath: { type: String, default: null },
    utmSource: { type: String, default: null },
    utmMedium: { type: String, default: null },
    utmCampaign: { type: String, default: null },
    device: { type: String, enum: ["desktop", "mobile", "tablet"], default: "desktop" },
    browser: { type: String, default: "Other" },
    os: { type: String, default: "Other" },
    screen: { type: String, default: null },
    language: { type: String, default: null },
    timezone: { type: String, default: null },
    country: { type: String, default: null },
    region: { type: String, default: null },
    city: { type: String, default: null },
    sessionId: { type: String, required: true, index: true },
    visitorHash: { type: String, required: true },
    returning: { type: Boolean, default: false },
    duration: { type: Number, default: 0, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: "pageViews" }
);

pageViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: PAGE_VIEW_TTL_SECONDS });
pageViewSchema.index({ createdAt: -1, path: 1 });
pageViewSchema.index({ placeId: 1, createdAt: -1 });

export const PageView = model<IPageView, PageViewModel>("PageView", pageViewSchema);
