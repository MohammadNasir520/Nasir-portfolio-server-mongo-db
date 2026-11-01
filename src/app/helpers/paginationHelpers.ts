import { SortOrder } from "mongoose";
import { IPaginationOptions } from "../../interfaces/pagination";

type IPaginationResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
};

const calculatePagination = (
  options: IPaginationOptions
): IPaginationResult => {
  const page = Math.max(1, Math.floor(Number(options.page)) || 1);
  // Capped so a public list endpoint can't be asked for a million rows.
  const limit = Math.min(200, Math.max(1, Math.floor(Number(options.limit)) || 10));
  const skip = (page - 1) * limit;

  // Plain field names only - no operators, paths into arrays or junk.
  const sortBy =
    typeof options.sortBy === "string" && /^[A-Za-z_][A-Za-z0-9_]{0,40}$/.test(options.sortBy)
      ? options.sortBy
      : "createdAt";
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";

  return { page, limit, skip, sortBy, sortOrder };
};

export const paginationHelpers = { calculatePagination };
