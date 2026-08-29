export const projectsSearchableFields = ["title", "stack"];

export const projectsFilterableFields = [
  "searchTerm",
  "level",
  "title",
  "stack",
  "technology",
];

// Exact-match filters, i.e. everything filterable except search and technology.
export const projectsExactFilterFields = ["level", "title", "stack"];
