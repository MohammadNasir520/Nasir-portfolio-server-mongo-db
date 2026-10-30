import express from "express";
import { AboutRoutes } from "../modules/about/about.routes";
import { AchievementRoutes } from "../modules/achievement/achievement.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BlogRoutes } from "../modules/blog/blog.routes";
import { ExperienceRoutes } from "../modules/experience/experience.routes";
import { ExtraActivitiesRoutes } from "../modules/extraActivities/extraActivities.routes";
import { LearningProjectsRoutes } from "../modules/learningProjects/learningProjects.routes";
import { ProfileRoutes } from "../modules/profile/profile.routes";
import { SiteProfileRoutes } from "../modules/siteProfile/siteProfile.routes";
import { SkillsRoutes } from "../modules/skills/skill.routes";
import { TravelRoutes } from "../modules/travel/travel.routes";
import { UploadsRoutes } from "../modules/uploads/uploads.routes";
import { authRateLimiter } from "../middlewares/rateLimit";

const router = express.Router();

// Sign-in/sign-up get a tighter budget than the rest of the API.
router.use("/auth", authRateLimiter, AuthRoutes);

// `/site-profile` replaced `/banners` and `/social-links`, which each stored a
// second copy of the owner's name, portrait, tagline and social URLs.
// `/site-profile` and `/profile` do not collide - Express matches whole segments.
const moduleRoutes = [
  { path: "/site-profile", route: SiteProfileRoutes },
  { path: "/uploads", route: UploadsRoutes },
  { path: "/profile", route: ProfileRoutes },
  { path: "/admins", route: AdminRoutes },
  { path: "/skills", route: SkillsRoutes },
  { path: "/experiences", route: ExperienceRoutes },
  { path: "/travel", route: TravelRoutes },
  { path: "/learning-projects", route: LearningProjectsRoutes },
  { path: "/blogs", route: BlogRoutes },
  { path: "/about", route: AboutRoutes },
  { path: "/achievements", route: AchievementRoutes },
  { path: "/extra-activities", route: ExtraActivitiesRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
