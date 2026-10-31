import { Schema, Types, model } from "mongoose";

export type ITravelMap = {
  user: Types.ObjectId;
  /** Shown on the visitor's map: "<name>'s Bangladesh". */
  name: string;
  /** District names, matching BD_DISTRICT_NAMES. */
  districts: string[];
  /** "<district>::<place>" keys from the frontend's wish list. */
  places: string[];
};

/**
 * A visitor's own "districts I have been to" map, built on /travel and saved
 * to their account so it follows them across devices. One per user.
 */
const travelMapSchema = new Schema<ITravelMap>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, default: "", trim: true, maxlength: 30 },
    districts: { type: [String], default: [] },
    places: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: "travelMaps",
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const TravelMap = model<ITravelMap>("TravelMap", travelMapSchema);
