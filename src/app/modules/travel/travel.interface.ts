import { Model, Types } from "mongoose";

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
  featured: boolean;
  galleryLayout: TravelGalleryLayout;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ITravelOverview = {
  _id?: Types.ObjectId;
  history: string;
  futurePlan: string;
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
};

export type TravelPlaceModel = Model<ITravelPlace, Record<string, unknown>>;
export type TravelOverviewModel = Model<ITravelOverview, Record<string, unknown>>;
