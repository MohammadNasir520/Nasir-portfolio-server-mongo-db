import { Model, Types } from "mongoose";

export const PROJECT_LEVELS = ["best", "learning"] as const;
export type ProjectLevel = (typeof PROJECT_LEVELS)[number];

export type IProjectImage = {
  url: string;
};

export type IProjects = {
  /** Per-locale translations of the text fields, e.g. { bn: { title } }. */
  i18n?: Record<string, Record<string, unknown>>;
  _id?: Types.ObjectId;
  level: ProjectLevel;
  title: string;
  overview: string;
  stack: string;
  newLearnings: string;
  liveLink: string;
  clientLink?: string;
  serverLink?: string;
  images: IProjectImage[];
  technology: string[];
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type IProjectsFilters = {
  searchTerm?: string;
  level?: string;
  title?: string;
  stack?: string;
  technology?: string | string[];
};

/**
 * The list endpoint returns its rows nested under `meta.data` rather than at the
 * top level. This mirrors the Prisma API exactly — the portfolio frontend reads
 * `projects.meta.data` and `projects.meta.total`, so the shape is load-bearing.
 */
export type IProjectsListResponse = {
  meta: {
    total: number;
    data: IProjects[];
  };
};

export type ProjectsModel = Model<IProjects, Record<string, unknown>>;
