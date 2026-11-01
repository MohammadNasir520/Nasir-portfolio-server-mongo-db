import { Model, Types } from "mongoose";
import { ContentLocale } from "../../../shared/localize";

export const TRAVEL_STATUS = ["visited", "planned"] as const;
export type TravelStatus = (typeof TRAVEL_STATUS)[number];

/**
 * Which gallery the frontend draws for a place. Set per place, so one journey
 * can get the big hero treatment and another a tidy grid.
 *   featured - one large image with a clickable thumbnail strip
 *   duo      - two-up grid of equal tiles
 *   masonry  - four staggered columns of natural-height images
 *   tabs     - one tab per image `album`
 */
export const TRAVEL_GALLERY_LAYOUTS = [
  "featured",
  "duo",
  "masonry",
  "tabs",
] as const;
export type TravelGalleryLayout = (typeof TRAVEL_GALLERY_LAYOUTS)[number];

/** `album` groups images into tabs; ignored by the other layouts. */
export type ITravelImage = { url: string; caption?: string; album?: string };
export type ITravelVideo = { url: string; title?: string };

export type ITravelPlace = {
  _id?: Types.ObjectId;
  name: string;
  /** Free text: countries are open ended, unlike Bangladesh's fixed districts. */
  country: string;
  /** Only meaningful for Bangladesh; validated against BD_DISTRICTS. */
  district?: string;
  status: TravelStatus;
  visitedOn?: Date | null;
  summary: string;
  story?: string;
  images: ITravelImage[];
  videos: ITravelVideo[];
  highlights: string[];
  /**
   * What kind of place this is ("beach", "hills", "heritage"...). Free text,
   * not an enum, so a new kind needs no code change. Not translated: these are
   * matching keys for recommendations, not display text.
   */
  tags: string[];
  featured: boolean;
  galleryLayout: TravelGalleryLayout;
  /** How many times the place page has been opened (see recordView). */
  views: number;
  /** Translations of the text fields, keyed by locale (see shared/localize). */
  i18n?: Partial<
    Record<
      ContentLocale,
      Partial<Pick<ITravelPlace, TravelPlaceI18nField>> & {
        /** English album name -> translated album name. */
        albums?: Record<string, string>;
      }
    >
  >;
  createdAt?: Date;
  updatedAt?: Date;
};

/** The text fields that have per-language versions. */
export const TRAVEL_PLACE_I18N_FIELDS = ["name", "summary", "story", "highlights"] as const;
export const TRAVEL_OVERVIEW_I18N_FIELDS = ["history", "futurePlan"] as const;
type TravelPlaceI18nField = (typeof TRAVEL_PLACE_I18N_FIELDS)[number];
type TravelOverviewI18nField = (typeof TRAVEL_OVERVIEW_I18N_FIELDS)[number];

export type ITravelOverview = {
  _id?: Types.ObjectId;
  history: string;
  futurePlan: string;
  i18n?: Partial<Record<ContentLocale, Partial<Pick<ITravelOverview, TravelOverviewI18nField>>>>;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ITravelPlaceFilters = {
  searchTerm?: string;
  country?: string;
  district?: string;
  status?: string;
  featured?: string;
};

export type ITravelStats = {
  countries: number;
  districtsVisited: number;
  goalDistricts: number;
  placesVisited: number;
  placesPlanned: number;
  photos: number;
  /** Sum of every place's page views. */
  totalViews: number;
};

export type TravelPlaceModel = Model<ITravelPlace, Record<string, unknown>>;
export type TravelOverviewModel = Model<ITravelOverview, Record<string, unknown>>;
