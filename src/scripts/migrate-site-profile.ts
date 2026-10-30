/**
 * Consolidates identity into the `siteProfile` singleton.
 *
 *   npm run migrate                  # migrate, keep the legacy collections
 *   npm run migrate -- --drop-legacy # migrate, then drop banner + socialLink
 *
 * Identity used to live in three collections at once - `banner` held the
 * display name, portrait and tagline, `socialLink` held five social URLs (and
 * no GitHub), `users` held the phone and two more portraits - while the public
 * site ignored all three and hardcoded its own copies, which had already
 * drifted apart. This script folds every source into one document.
 *
 * Two design rules make it safe to re-run:
 *   - Sources are read through the raw driver, not through Mongoose models, so
 *     the script keeps compiling after the banner/socialLink modules are
 *     deleted and can run before or after that removal.
 *   - Existing siteProfile values always win, so a second run never clobbers
 *     edits made in the dashboard.
 */
import mongoose from "mongoose";
import config from "../config";
import { ENUM_USER_ROLE } from "../enums/user";
import { SiteProfile } from "../app/modules/siteProfile/siteProfile.model";

/**
 * Values the public site is displaying today from hardcoded JSX. Without these
 * the email, GitHub link, résumé URL and headline would migrate as empty
 * strings and the site would visibly lose data.
 */
const FRONTEND_FALLBACKS = {
  // Frontend/src/components/Banner/Banner.tsx:61
  headline: "Full Stack Developer",
  // Frontend/src/components/Banner/Banner.tsx:64-67
  tagline:
    "I build production web applications with Next.js, Node.js and MongoDB — from the first schema through to the deployed product.",
  // Frontend/src/components/Footer/Footer.tsx:48 - deliberately NOT the admin
  // login address; this is the published contact address.
  email: "mdnasiruddin5201@gmail.com",
  // Frontend/src/components/Footer/Footer.tsx:52
  phone: "+8801729678295",
  // Frontend/src/components/Footer/Footer.tsx:56
  location: "Dinajpur, Bangladesh",
  // Used by the navbar, footer and dashboard sidebar.
  avatar: "/images/Nasir-Graduation.jpg",
  // Frontend/src/components/Banner/Banner.tsx:42-43 - the hero crossfades these.
  heroImages: [
    { url: "/images/Nasir-Graduation.jpg", alt: "Md. Nasir Uddin" },
    { url: "/images/Nasir-Portrait.jpg", alt: "Md. Nasir Uddin" },
  ],
  // Frontend/src/utils/downloadResume.ts:3
  resumeUrl:
    "https://drive.google.com/uc?export=download&id=1BSH1hpXYoyyDKIpCDne_5BgWNZwRHDDV",
  // Frontend/src/components/Banner/Banner.tsx:13 - socialLink has no github field.
  github: "https://github.com/MohammadNasir520",
  // Frontend/src/app/layout.tsx:6-7
  metaTitle: "Nasir Uddin",
  metaDescription: "Nasir Uddins' Portfolio",
};

/** First value that is a non-empty string, else "". */
const firstText = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const run = async () => {
  if (!config.database_url) {
    throw new Error("DATABASE_URL is not set");
  }
  const dropLegacy = process.argv.includes("--drop-legacy");

  await mongoose.connect(config.database_url);
  const db = mongoose.connection.db;

  // ---- 1. collapse any duplicate singletons ------------------------------
  const duplicates = await SiteProfile.find().sort({ createdAt: 1 }).skip(1);
  if (duplicates.length) {
    console.warn(
      `found ${duplicates.length} extra siteProfile document(s); only the oldest was ever reachable - deleting the rest`
    );
    await SiteProfile.deleteMany({
      _id: { $in: duplicates.map((doc) => doc._id) },
    });
  }

  const existing = (await SiteProfile.findOne())?.toObject() ?? null;

  // ---- 2. read the legacy sources through the raw driver ------------------
  const collections = (await db.listCollections().toArray()).map((c) => c.name);
  const readOne = async (name: string, filter: Record<string, unknown> = {}) =>
    collections.includes(name)
      ? await db.collection(name).findOne(filter, { sort: { createdAt: 1 } })
      : null;

  const banner = await readOne("banner");
  const about = await readOne("about");
  const socialLink = await readOne("socialLink");
  const owner = await readOne("users", {
    role: { $in: [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN] },
  });

  // ---- 3. compose, existing values winning -------------------------------
  const composed = {
    name: firstText(existing?.name, banner?.title, owner?.name),
    headline: firstText(existing?.headline, FRONTEND_FALLBACKS.headline),
    tagline: firstText(
      existing?.tagline,
      banner?.description,
      FRONTEND_FALLBACKS.tagline
    ),
    bio: firstText(existing?.bio, about?.description),
    email: firstText(existing?.email, FRONTEND_FALLBACKS.email, owner?.email),
    phone: firstText(
      existing?.phone,
      owner?.contactNo,
      FRONTEND_FALLBACKS.phone
    ),
    location: firstText(existing?.location, FRONTEND_FALLBACKS.location),
    // The frontend's own avatar wins over banner.logo. banner.logo held the
    // *hero* portrait, not the small round avatar, so preferring it here
    // silently swapped the navbar and footer image.
    avatar: firstText(
      existing?.avatar,
      FRONTEND_FALLBACKS.avatar,
      banner?.logo,
      owner?.image1
    ),
    // Exactly what the hero crossfades today. banner.logo, user.image1 and
    // user.image2 are reported below as extra portraits the admin can add,
    // rather than being spliced in and changing the animation.
    heroImages: existing?.heroImages?.length
      ? existing.heroImages
      : FRONTEND_FALLBACKS.heroImages,
    resumeUrl: firstText(existing?.resumeUrl, FRONTEND_FALLBACKS.resumeUrl),
    socials: {
      github: firstText(existing?.socials?.github, FRONTEND_FALLBACKS.github),
      // Note the casing change: socialLink spelled it `linkedIn`.
      linkedin: firstText(existing?.socials?.linkedin, socialLink?.linkedIn),
      facebook: firstText(existing?.socials?.facebook, socialLink?.facebook),
      twitter: firstText(existing?.socials?.twitter, socialLink?.twitter),
      instagram: firstText(existing?.socials?.instagram, socialLink?.instagram),
      // about.youtube was a straight duplicate of socialLink.youtube.
      youtube: firstText(
        existing?.socials?.youtube,
        socialLink?.youtube,
        about?.youtube
      ),
    },
    metaTitle: firstText(existing?.metaTitle, FRONTEND_FALLBACKS.metaTitle),
    metaDescription: firstText(
      existing?.metaDescription,
      FRONTEND_FALLBACKS.metaDescription
    ),
  };

  // Flatten socials so a re-run merges instead of replacing the sub-document.
  const $set: Record<string, unknown> = { ...composed };
  delete $set.socials;
  for (const [network, url] of Object.entries(composed.socials)) {
    $set[`socials.${network}`] = url;
  }

  const profile = await SiteProfile.findOneAndUpdate(
    {},
    { $set },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  // ---- 4. make sure a super_admin exists ---------------------------------
  // POST /admins and PATCH /admins/:id require super_admin, but the seed
  // created a plain admin - so admin management was unreachable.
  const users = db.collection("users");
  if (!(await users.findOne({ role: ENUM_USER_ROLE.SUPER_ADMIN }))) {
    const oldest = await users.findOne(
      { role: { $in: [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN] } },
      { sort: { createdAt: 1 } }
    );
    if (oldest) {
      await users.updateOne(
        { _id: oldest._id },
        { $set: { role: ENUM_USER_ROLE.SUPER_ADMIN } }
      );
      console.log(`promoted ${oldest.email} to super_admin`);
    } else {
      console.warn("no admin account found to promote - run npm run seed first");
    }
  }

  // ---- 5. drop the fields that moved -------------------------------------
  // $unset of an absent field is a no-op, so re-runs are free.
  const stripped = await users.updateMany(
    {},
    { $unset: { contactNo: "", image1: "", image2: "" } }
  );
  // about.youtube now lives at siteProfile.socials.youtube.
  if (collections.includes("about")) {
    await db.collection("about").updateMany({}, { $unset: { youtube: "" } });
  }

  // ---- 6. optionally drop the superseded collections ---------------------
  if (dropLegacy) {
    for (const name of ["banner", "socialLink"]) {
      if (collections.includes(name)) {
        await db.collection(name).drop();
        console.log(`dropped legacy collection: ${name}`);
      }
    }
  }

  console.table({
    name: profile?.name,
    headline: profile?.headline,
    email: profile?.email,
    phone: profile?.phone,
    location: profile?.location,
    avatar: profile?.avatar,
    heroImages: profile?.heroImages?.length ?? 0,
    github: profile?.socials?.github,
    linkedin: profile?.socials?.linkedin,
    facebook: profile?.socials?.facebook,
    usersStripped: stripped.modifiedCount,
  });

  if (!profile?.location) {
    console.warn("location is empty - set it in the dashboard");
  }
  // Surfaced rather than merged: these were stored but never displayed.
  const spare = [banner?.logo, owner?.image1, owner?.image2]
    .filter((url): url is string => Boolean(url))
    .filter((url) => url !== profile?.avatar)
    .filter((url, i, all) => all.indexOf(url) === i);
  if (spare.length) {
    console.log(
      `other portraits found, not used automatically: ${spare.join(", ")}`
    );
  }
  if (!dropLegacy) {
    console.log(
      "legacy collections retained. Verify GET /api/v1/site-profile, then re-run with -- --drop-legacy"
    );
  }

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("migration failed:", error);
  process.exit(1);
});
