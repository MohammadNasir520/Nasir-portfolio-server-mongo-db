/**
 * Language-specific content stored on the document itself:
 *
 *   { name: "Jaflong", summary: "...",            <- English, the source text
 *     i18n: { bn: { name: "জাফলং", ... },
 *             ar: { name: "جافلونج", ... } } }
 *
 * Read endpoints take ?lang=bn|ar and get the translated fields swapped in,
 * falling back to English field by field. Without ?lang (the dashboard) the
 * raw document - i18n included - is returned, so editing never overwrites the
 * English text with a translation.
 */
export const CONTENT_LOCALES = ["bn", "ar"] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];

export const parseLang = (value: unknown): ContentLocale | undefined =>
  CONTENT_LOCALES.includes(value as ContentLocale) ? (value as ContentLocale) : undefined;

const isFilled = (value: unknown) =>
  Array.isArray(value) ? value.length > 0 : typeof value === "string" ? value.trim() !== "" : value != null;

type WithToJSON = { toJSON?: () => Record<string, unknown> };

/**
 * Swap translated fields in; drop the i18n map from public responses.
 *
 * The English values that were replaced travel along as `original`, because
 * clients match on them (e.g. a place's English name against the wish list).
 */
export const localizeDoc = <T>(doc: T, lang: ContentLocale | undefined, fields: readonly string[]): T => {
  if (!doc || !lang) return doc;
  const plain = ((doc as WithToJSON).toJSON?.() ?? doc) as Record<string, any>;
  const translated = plain.i18n?.[lang] ?? {};
  const out: Record<string, any> = { ...plain, lang, original: {} };
  for (const field of fields) {
    if (!isFilled(translated[field])) continue;
    out.original[field] = plain[field];
    out[field] = translated[field];
  }
  delete out.i18n;
  return out as T;
};
