import { DEFAULT_SITE_PROFILE } from "./siteProfile.constants";
import { ISiteProfile } from "./siteProfile.interface";
import { SiteProfile } from "./siteProfile.model";

const getSiteProfile = async (): Promise<ISiteProfile> => {
  const profile = await SiteProfile.findOne();
  // Never null: the public site reads these fields unconditionally, and
  // sendResponse would drop a falsy payload entirely.
  return profile ?? DEFAULT_SITE_PROFILE;
};

const updateSiteProfile = async (
  payload: Partial<ISiteProfile>
): Promise<ISiteProfile | null> => {
  const { socials, ...rest } = payload;
  const update: Record<string, unknown> = { ...rest };

  // Flatten `socials` to dot-notation. A plain $set of the nested object would
  // replace the whole sub-document, so saving just the GitHub URL would blank
  // every other network.
  if (socials) {
    for (const [network, url] of Object.entries(socials)) {
      update[`socials.${network}`] = url;
    }
  }

  // Singleton: create it on first write rather than requiring a seed.
  return SiteProfile.findOneAndUpdate(
    {},
    { $set: update },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};

export const SiteProfileService = {
  getSiteProfile,
  updateSiteProfile,
};
