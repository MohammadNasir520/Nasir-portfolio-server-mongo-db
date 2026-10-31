import { Schema, model } from "mongoose";

export const UI_LOCALES = ["en", "bn", "ar"] as const;
export type UiLocale = (typeof UI_LOCALES)[number];

export type ITranslation = {
  /** Groups strings by page or feature, e.g. "travel", "districts". */
  route: string;
  lang: UiLocale;
  /** Nested key -> string map, read by the frontend's t("route.key"). */
  translations: Record<string, unknown>;
};

/**
 * Static UI text per language - the same shape Ziarah's CMS uses. The frontend
 * deep-merges these over its bundled locale files, so the database wins where
 * it has a value and the bundled file fills any gap.
 */
const translationSchema = new Schema<ITranslation>(
  {
    route: { type: String, required: true, trim: true },
    lang: { type: String, enum: UI_LOCALES, required: true },
    translations: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    collection: "translations",
    minimize: false,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

translationSchema.index({ route: 1, lang: 1 }, { unique: true });

export const Translation = model<ITranslation>("Translation", translationSchema);
