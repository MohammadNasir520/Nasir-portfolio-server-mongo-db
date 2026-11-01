/**
 * zod 4 replaced `required_error` with a single `error` option that also fires
 * for wrong types and failed formats - so a bad email would read
 * "email is required". This keeps the custom text for a missing value only and
 * lets zod's own message describe every other problem.
 */
export const required = (message: string) => ({
  error: (issue: { input: unknown }) => (issue.input === undefined ? message : undefined),
});
