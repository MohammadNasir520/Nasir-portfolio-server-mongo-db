/**
 * Escape user input before it goes into a Mongo `$regex`. Raw input lets a
 * visitor send `(` (a 500 with Mongo's internal message) or a catastrophic
 * pattern like `(a+)+$` that pins the database on a collection scan.
 * Also caps the length - nobody searches a portfolio with a 1000-char query.
 */
export const escapeRegex = (input: string): string =>
  String(input).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
