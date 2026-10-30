import { Schema, model } from "mongoose";
import { BD_DISTRICT_NAMES } from "./bdDistricts";
import {
  ITravelOverview,
  ITravelPlace,
  TRAVEL_GALLERY_LAYOUTS,
  TRAVEL_STATUS,
  TravelOverviewModel,
  TravelPlaceModel,
} from "./travel.interface";

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: "" },
    // Only the "tabs" gallery reads this; it becomes the tab label.
    album: { type: String, default: "" },
  },
  { _id: false }
);

const videoSchema = new Schema(
  { url: { type: String, required: true }, title: { type: String, default: "" } },
  { _id: false }
);

const travelPlaceSchema = new Schema<ITravelPlace, TravelPlaceModel>(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    // Enum-bound so a typo cannot silently skew the district progress metric.
    district: { type: String, enum: [...BD_DISTRICT_NAMES, null], default: null },
    status: { type: String, enum: TRAVEL_STATUS, default: "planned" },
    visitedOn: { type: Date, default: null },
    summary: { type: String, required: true },
    story: { type: String, default: "" },
    images: { type: [imageSchema], default: [] },
    videos: { type: [videoSchema], default: [] },
    highlights: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    galleryLayout: {
      type: String,
      enum: TRAVEL_GALLERY_LAYOUTS,
      default: "featured",
    },
  },
  {
    timestamps: true,
    collection: "travelPlaces",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

travelPlaceSchema.index({ country: 1, district: 1, status: 1 });

export const TravelPlace = model<ITravelPlace, TravelPlaceModel>(
  "TravelPlace",
  travelPlaceSchema
);

const travelOverviewSchema = new Schema<ITravelOverview, TravelOverviewModel>(
  {
    history: { type: String, default: "" },
    futurePlan: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "travelOverview",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const TravelOverview = model<ITravelOverview, TravelOverviewModel>(
  "TravelOverview",
  travelOverviewSchema
);
