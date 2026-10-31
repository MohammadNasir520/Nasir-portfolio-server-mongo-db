import { ITranslation, Translation, UI_LOCALES, UiLocale } from "./translation.model";

/** All routes for one language (or every language), optionally one route. */
const getAll = async (lang?: string, route?: string) => {
  const filter: Record<string, string> = {};
  if (lang && UI_LOCALES.includes(lang as UiLocale)) filter.lang = lang;
  if (route) filter.route = route;
  return Translation.find(filter).sort({ route: 1, lang: 1 });
};

/** Replace one route's strings for one language; the first save creates it. */
const upsert = async (payload: ITranslation) =>
  Translation.findOneAndUpdate(
    { route: payload.route, lang: payload.lang },
    { $set: { translations: payload.translations } },
    { new: true, upsert: true, runValidators: true }
  );

export const TranslationService = { getAll, upsert };
