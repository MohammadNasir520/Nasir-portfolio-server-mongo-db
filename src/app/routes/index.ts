import express from "express";
import { AboutRoutes } from "../modules/about/about.routes";
import { AchievementRoutes } from "../modules/achievement/achievement.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BannerRoutes } from "../modules/banner/banner.routes";
import { BlogRoutes } from "../modules/blog/blog.routes";
import { ExtraActivitiesRoutes } from "../modules/extraActivities/extraActivities.routes";
import { LearningProjectsRoutes } from "../modules/learningProjects/learningProjects.routes";
import { ProfileRoutes } from "../modules/profile/profile.routes";
import { SkillsRoutes } from "../modules/skills/skill.routes";
import { SocialLinkRoutes } from "../modules/socialLink/socialLink.routes";
import { authRateLimiter } from "../middlewares/rateLimit";

const router = express.Router();

// Sign-in/sign-up get a tighter budget than the rest of the API.
router.use("/auth", authRateLimiter, AuthRoutes);

const moduleRoutes = [
  { path: "/profile", route: ProfileRoutes },
  { path: "/admins", route: AdminRoutes },
  { path: "/skills", route: SkillsRoutes },
  { path: "/learning-projects", route: LearningProjectsRoutes },
  { path: "/blogs", route: BlogRoutes },
  { path: "/about", route: AboutRoutes },
  { path: "/banners", route: BannerRoutes },
  { path: "/social-links", route: SocialLinkRoutes },
  { path: "/achievements", route: AchievementRoutes },
  { path: "/extra-activities", route: ExtraActivitiesRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
