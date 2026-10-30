/**
 * Seeds the local portfolio database with demo content.
 *
 *   npm run seed          # wipe the seeded collections and re-insert
 *
 * Image paths are relative to the Next.js `public/` folder, so they render
 * through next/image with no `next.config.js` domain whitelisting.
 *
 * Two couplings the frontend depends on, do not break them casually:
 *   - Projects.tsx queries `{ level: "best" }`, so some projects must be "best".
 *   - Skills link to /related-projects/<skill.title>, which filters projects by
 *     `technology`. Skill titles must therefore appear verbatim in a project's
 *     `technology` array.
 */
import mongoose from "mongoose";
import config from "../config";
import { About } from "../app/modules/about/about.model";
import { SiteProfile } from "../app/modules/siteProfile/siteProfile.model";
import { Achievement } from "../app/modules/achievement/achievement.model";
import { Blog } from "../app/modules/blog/blog.model";
import { Experience } from "../app/modules/experience/experience.model";
import { ExtraActivities } from "../app/modules/extraActivities/extraActivities.model";
import { Projects } from "../app/modules/learningProjects/learningProjects.model";
import { Skill } from "../app/modules/skills/skill.model";
import {
  TravelOverview,
  TravelPlace,
} from "../app/modules/travel/travel.model";
import { User } from "../app/modules/user/user.model";
import { ENUM_USER_ROLE } from "../enums/user";

const skills = [
  { title: "React.js", image: "/images/skills/react.png", level: "Expert" },
  { title: "Next.js", image: "/images/skills/nextjs.png", level: "Expert" },
  { title: "Node.js", image: "/images/skills/nodejs.png", level: "Advanced" },
  { title: "Express.js", image: "/images/skills/express.png", level: "Advanced" },
  { title: "MongoDB", image: "/images/skills/mongodb.png", level: "Advanced" },
  { title: "PostgreSQL", image: "/images/skills/postgresql.png", level: "Intermediate" },
  { title: "Typescript", image: "/images/skills/typescript.png", level: "Advanced" },
  { title: "JavaScript", image: "/images/skills/javascript.png", level: "Expert" },
  { title: "Redux", image: "/images/skills/redux.png", level: "Advanced" },
  { title: "Tailwind", image: "/images/skills/tailwind.png", level: "Expert" },
  { title: "Firebase", image: "/images/skills/firebase.png", level: "Intermediate" },
  { title: "GraphQL", image: "/images/skills/graphql.png", level: "Beginner" },
];

const projects = [
  {
    level: "best",
    title: "Tuition Media",
    overview:
      "A tuition marketplace connecting guardians with verified tutors. Guardians post requirements, tutors apply, and admins moderate every booking from a dashboard.",
    stack: "FullStack",
    newLearnings:
      "Role based access control with JWT refresh tokens, and aggregation pipelines for the tutor matching feed.",
    liveLink: "https://tuition-media.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/tuition-media-client",
    serverLink: "https://github.com/MohammadNasir520/tuition-media-server",
    images: [{ url: "/images/tuitionMedia.png" }],
    technology: ["React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "Redux", "Typescript", "Tailwind"],
    features: [
      "Guardian and tutor onboarding with separate dashboards",
      "Tutor search with subject, salary and location filters",
      "Admin moderation queue for every booking request",
      "JWT auth with refresh token rotation",
    ],
  },
  {
    level: "best",
    title: "Book Center",
    overview:
      "An online bookstore with category browsing, a persistent cart and an order pipeline. Built to practise normalised relational modelling with Prisma.",
    stack: "FullStack",
    newLearnings:
      "Prisma relations and transactions, plus optimistic cart updates in Redux Toolkit Query.",
    liveLink: "https://book-center-demo.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/book-center-client",
    serverLink: "https://github.com/MohammadNasir520/book-center-server",
    images: [{ url: "/images/bookCenter.png" }],
    technology: ["React.js", "Next.js", "PostgreSQL", "Node.js", "Express.js", "Typescript", "Tailwind"],
    features: [
      "Category and author browsing with server side pagination",
      "Persistent cart backed by Redux Toolkit Query",
      "Checkout with order history per user",
      "Admin CRUD for inventory",
    ],
  },
  {
    level: "best",
    title: "Job Preparation Hub",
    overview:
      "A study platform with topic-wise question banks, timed mock exams and a score history chart so candidates can track progress over time.",
    stack: "FullStack",
    newLearnings:
      "Timed exam state that survives refreshes, and computing per-topic accuracy with MongoDB aggregation.",
    liveLink: "https://job-preparation-hub.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/job-preparation-client",
    serverLink: "https://github.com/MohammadNasir520/job-preparation-server",
    images: [{ url: "/images/jobPreparation.png" }],
    technology: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "Tailwind"],
    features: [
      "Topic-wise question bank with difficulty tags",
      "Timed mock exams with auto submit",
      "Score history and per-topic accuracy breakdown",
      "Bookmark questions for later revision",
    ],
  },
  {
    level: "best",
    title: "Online Newspaper",
    overview:
      "A publishing platform with an editorial workflow: reporters draft, editors approve, and approved stories appear on the public front page instantly.",
    stack: "FullStack",
    newLearnings:
      "Draft/publish state machines and incremental static regeneration for article pages.",
    liveLink: "https://online-newspaper-demo.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/online-newspaper-client",
    serverLink: "https://github.com/MohammadNasir520/online-newspaper-server",
    images: [{ url: "/images/onlineNewsPaper.png" }],
    technology: ["Next.js", "React.js", "MongoDB", "Node.js", "Typescript", "Tailwind"],
    features: [
      "Reporter drafting with editor approval queue",
      "Category front pages with featured slots",
      "ISR so published articles go live without a rebuild",
      "Reader comments with moderation",
    ],
  },
  {
    level: "learning",
    title: "TV Shop",
    overview:
      "An electronics storefront built to practise product filtering and comparison. Shoppers filter by brand, price band and rating, then compare up to three products side by side.",
    stack: "Frontend",
    newLearnings:
      "Composing many independent filters into a single query string without re-render storms.",
    liveLink: "https://tv-shop-demo.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/tv-shop",
    images: [{ url: "/images/tvshop.png" }],
    technology: ["React.js", "Redux", "JavaScript", "Tailwind"],
    features: [
      "Multi-axis filtering by brand, price and rating",
      "Side by side comparison of up to three products",
      "Cart persisted to localStorage",
    ],
  },
  {
    level: "learning",
    title: "World Cup Web",
    overview:
      "A tournament companion showing fixtures, live-style score cards and a group standings table computed from match results.",
    stack: "Frontend",
    newLearnings:
      "Deriving standings from raw results rather than storing them, and formatting fixtures across timezones.",
    liveLink: "https://world-cup-web-demo.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/world-cup-web",
    images: [{ url: "/images/worldCupWeb.png" }],
    technology: ["React.js", "JavaScript", "Firebase", "Tailwind"],
    features: [
      "Fixture list grouped by matchday",
      "Standings table derived from match results",
      "Team detail pages with squad lists",
    ],
  },
  {
    level: "learning",
    title: "Donate Today",
    overview:
      "A donation platform where campaigns show a live funding progress bar and donors get a receipt history under their account.",
    stack: "FullStack",
    newLearnings:
      "Idempotent donation writes so a retried request cannot double-count a contribution.",
    liveLink: "https://donate-today-demo.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/donate-today-client",
    serverLink: "https://github.com/MohammadNasir520/donate-today-server",
    images: [{ url: "/images/donateTody.png" }],
    technology: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript"],
    features: [
      "Campaign pages with live funding progress",
      "Donor receipt history",
      "Idempotent donation recording",
    ],
  },
  {
    level: "learning",
    title: "Educational Portal",
    overview:
      "A course portal with enrolment, sequential lesson unlocking and a per-student completion tracker.",
    stack: "FullStack",
    newLearnings:
      "Modelling course/module/lesson hierarchies and gating lesson access on prior completion.",
    liveLink: "https://educational-portal-demo.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/educational-portal",
    images: [{ url: "/images/educational.png" }],
    technology: ["Next.js", "React.js", "MongoDB", "Node.js", "Typescript"],
    features: [
      "Course, module and lesson hierarchy",
      "Sequential lesson unlocking",
      "Per-student completion tracking",
    ],
  },
  {
    level: "learning",
    title: "Daily Routine Tracker",
    overview:
      "A habit tracker with a streak calendar and weekly completion chart, built as a focused exercise in date handling.",
    stack: "Frontend",
    newLearnings:
      "Timezone-safe streak calculation, and why storing local dates as UTC midnight avoids off-by-one days.",
    liveLink: "https://daily-routine-demo.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/daily-routine",
    images: [{ url: "/images/dayliroutine.png" }],
    technology: ["React.js", "Firebase", "JavaScript", "Tailwind"],
    features: [
      "Streak calendar with timezone-safe rollover",
      "Weekly completion chart",
      "Habit CRUD with reminder times",
    ],
  },
  {
    level: "learning",
    title: "Social Media App",
    overview:
      "A small social network with a following feed, likes and threaded comments — built to practise denormalised read models.",
    stack: "Backend",
    newLearnings:
      "Fan-out-on-read vs fan-out-on-write for feeds, and indexing strategy for the follow graph.",
    liveLink: "https://social-media-demo.vercel.app",
    serverLink: "https://github.com/MohammadNasir520/social-media-server",
    images: [{ url: "/images/socialMedia.png" }],
    technology: ["Node.js", "Express.js", "MongoDB", "Typescript", "GraphQL"],
    features: [
      "Following-based timeline",
      "Threaded comments",
      "Follow graph with compound indexes",
    ],
  },
];

// Placeholder work history - edit these to your real roles.
const experiences = [
  {
    company: "Ziarah Travel",
    role: "Full Stack Developer",
    employmentType: "Full-time",
    location: "Remote",
    startDate: new Date("2025-01-06"),
    endDate: null,
    current: true,
    description:
      "Building and maintaining the Ziarah booking platform on Next.js and Node.js, from the public booking flow through to the internal operations dashboard.",
    responsibilities: [
      "Ship features across the Next.js App Router frontend and the Express API",
      "Design MongoDB schemas and aggregation pipelines for booking and reporting",
      "Review pull requests and keep the shared component library consistent",
    ],
    technology: ["Next.js", "React.js", "Node.js", "Express.js", "MongoDB", "Typescript", "Tailwind"],
  },
  {
    company: "Freelance / Contract",
    role: "MERN Stack Developer",
    employmentType: "Freelance",
    location: "Dhaka, Bangladesh",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-12-20"),
    current: false,
    description:
      "Delivered full stack web applications for small businesses, taking each project from requirements through deployment and handover.",
    responsibilities: [
      "Translated client requirements into schemas and API contracts",
      "Built responsive React frontends with Redux Toolkit Query",
      "Deployed to Vercel and set up monitoring and backups",
    ],
    technology: ["React.js", "Node.js", "Express.js", "MongoDB", "Redux", "JavaScript"],
  },
  {
    company: "Q Startups Pvt. Ltd.",
    role: "Backend Developer Intern",
    employmentType: "Internship",
    location: "Remote",
    startDate: new Date("2023-03-10"),
    endDate: new Date("2023-04-18"),
    current: false,
    description:
      "Backend development internship at Q Startups, completed with a certificate of completion and a written recommendation from the company's HR executive.",
    responsibilities: [
      "Worked as the assigned backend developer on company projects",
      "Delivered every assigned project within the given timeframe",
      "Worked under the supervision and mentorship of the HR executive",
    ],
    technology: ["Node.js", "Express.js", "MongoDB", "JavaScript"],
  },
];

/**
 * One Wikimedia Commons photograph. Files live in the frontend's
 * public/images/traveling/; the caption carries the attribution the CC
 * licences require. `album` is the tab label for the "tabs" gallery layout.
 */
const commons = (
  file: string,
  subject: string,
  by: string,
  licence: string,
  album: string
) => ({
  url: `/images/traveling/${file}.jpg`,
  caption: `${subject} — photo by ${by} (${licence}), via Wikimedia Commons`,
  album,
});

// Travel: 8 visited districts as given by Nasir. Saint Martin is a place inside
// Cox's Bazar district, not a district of its own.
//
// Photographs live in public/images/traveling/ rather than being hotlinked:
// Wikimedia answers 429 to hotlinking clients, which made next/image fail
// intermittently. Captions carry the CC attribution the licences require.
// `galleryLayout` picks which of PlaceGallery's four layouts a place renders
// with; the two places still carrying no images exercise the empty state.
const travelPlaces = [
  {
    name: "Saint Martin's Island",
    country: "Bangladesh",
    district: "Cox's Bazar",
    status: "visited",
    visitedOn: new Date("2023-01-20"),
    featured: true,
    galleryLayout: "featured",
    summary:
      "The only coral island in Bangladesh, at the very southern tip of the country.",
    story:
      "An overnight bus to Teknaf and then a ship across to the island. Clear water, coral rock along the shore, and the quietest night sky I have seen in Bangladesh.",
    images: [
      { url: "/images/traveling/saintmartin1.jpg", caption: "Saint Martin shoreline" },
      commons("saintmartin-01", "A dog sits on the island of Saint Martin, Cox's Bazar, Bangladesh", "Tanvir Rahat", "CC BY-SA 4.0", "Island"),
      commons("saintmartin-02", "Aerial panoramic view of Saint Martin’s Island at sunrise, Bangladesh", "Khondoker Zobaed", "CC BY 4.0", "Island"),
      commons("saintmartin-03", "Blue waters of Saint Martin Island , Bangladesh", "Tanvir Rahat", "CC BY-SA 4.0", "Island"),
      commons("saintmartin-04", "Chera Dip of Saint Martin Island, Bangladesh", "Labib Ittihadul", "CC BY 2.0", "Chhera Dwip"),
      commons("saintmartin-05", "After Scuba Diving at Chera dwip.. under water", "Fahad Faisal", "CC BY-SA 3.0", "Chhera Dwip"),
      commons("saintmartin-06", "Chera Dweep", "Fatima.nisha", "CC BY-SA 4.0", "Chhera Dwip"),
      commons("saintmartin-07", "Chera dweep", "Fatima.nisha", "CC BY-SA 4.0", "Chhera Dwip"),
      commons("saintmartin-08", "Chera dweep", "Fatima.nisha", "CC BY-SA 4.0", "Chhera Dwip"),
      commons("saintmartin-09", "Aerial panorama of Saint Martin’s Island with sun reflection", "Khondoker Zobaed", "CC BY 4.0", "Island"),
      commons("saintmartin-10", "Aerial sunrise panorama of Saint Martin’s Island", "Khondoker Zobaed", "CC BY 4.0", "Island"),
      commons("saintmartin-11", "Aerial view of Saint Martin’s Island coral formations", "Khondoker Zobaed", "CC BY 4.0", "Island"),
      commons("saintmartin-12", "Anchor Saint Martin", "Rocky Masum", "CC BY-SA 4.0", "Island"),
      commons("saintmartin-13", "BGB Jetty Ghat, Teknaf", "Rocky Masum", "CC BY-SA 4.0", "Teknaf"),
      commons("saintmartin-14", "Evening at Teknaf beach", "Rocky Masum", "CC BY-SA 4.0", "Teknaf"),
      commons("saintmartin-15", "Evening at Teknaf beach", "Rocky Masum", "CC BY-SA 4.0", "Teknaf"),
      commons("saintmartin-16", "Evening at Teknaf beach", "Rocky Masum", "CC BY-SA 4.0", "Teknaf"),
    ],
    videos: [],
    highlights: ["Coral shoreline", "Chhera Dwip day trip", "Fresh caught seafood"],
  },
  {
    name: "Cox's Bazar Sea Beach",
    country: "Bangladesh",
    district: "Cox's Bazar",
    status: "visited",
    visitedOn: new Date("2023-01-18"),
    featured: true,
    galleryLayout: "duo",
    summary: "The longest natural sea beach in the world, 120 km of unbroken sand.",
    images: [
      commons("coxsbazar-01", "Cox's Bazar Sea Beach in 2024", "CAPTAIN RAJU", "CC0", "Beach"),
      commons("coxsbazar-02", "Cox's Bazar Sea Beach in 2024", "CAPTAIN RAJU", "CC0", "Beach"),
      commons("coxsbazar-03", "Cox's Bazar Sea Beach in 2024", "CAPTAIN RAJU", "CC0", "Beach"),
      commons("coxsbazar-04", "Cox's Bazar Sea Beach in 2024", "CAPTAIN RAJU", "CC0", "Beach"),
      commons("coxsbazar-05", "At the beach of Cox's Bazar", "Kritzolina", "CC BY-SA 4.0", "Beach"),
      commons("coxsbazar-06", "Cox's Bazar Sea Beach in November 2017", "Kritzolina", "CC BY-SA 4.0", "Beach"),
      commons("coxsbazar-07", "Cox's Bazar Sea Beach in November 2017", "Kritzolina", "CC BY-SA 4.0", "Beach"),
      commons("coxsbazar-08", "Cox's Bazar Sea Beach in November 2017", "Kritzolina", "CC BY-SA 4.0", "Beach"),
      commons("coxsbazar-09", "Beauty of inani-beach at Cox's bazar", "Syed sajidul islam", "CC BY-SA 4.0", "Inani"),
      commons("coxsbazar-10", "Cox's Bazar sea beach", "Thenameissayem", "CC BY-SA 4.0", "Beach"),
      commons("coxsbazar-11", "Inani Beach,Cox's Bazar", "Abdul Kaium Tito", "CC BY-SA 4.0", "Inani"),
      commons("coxsbazar-12", "Inani Beach, Coxs Bazar, Bangladesh", "Tanvir Rahat", "CC BY-SA 4.0", "Inani"),
      commons("coxsbazar-13", "Himchari, Cox's Bazar", "Moheen Reeyad", "CC BY-SA 4.0", "Himchari"),
      commons("coxsbazar-14", "Himchari, Cox's Bazar", "Moheen Reeyad", "CC BY-SA 4.0", "Himchari"),
      commons("coxsbazar-15", "Himchari Fountain and Hill in 2024", "CAPTAIN RAJU", "CC0", "Himchari"),
      commons("coxsbazar-16", "Himchari Fountain and Hill in 2024", "CAPTAIN RAJU", "CC0", "Himchari"),
    ],
    videos: [],
    highlights: ["Sunset at Laboni Point", "Himchari viewpoint", "Inani rocky beach"],
  },
  {
    name: "Jaflong",
    country: "Bangladesh",
    district: "Sylhet",
    status: "visited",
    visitedOn: new Date("2023-08-12"),
    featured: true,
    galleryLayout: "featured",
    summary: "Stone-strewn riverbed at the Meghalaya border, under the Indian hills.",
    images: [
      commons("jaflong-01", "Jaflong, Sylhet, Bangladesh", "Salam Khokon", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-02", "Jaflong, Sylhet", "Derived Constant", "CC BY 4.0", "Jaflong"),
      commons("jaflong-03", "Jaflong, sylhet", "Koniiica", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-04", "Jaflong, sylhet", "Koniiica", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-05", "Bangladesh - India border in 2021", "CAPTAIN RAJU", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-06", "Bangladesh - India border in 2021", "CAPTAIN RAJU", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-07", "Bangladesh - India border in 2021", "CAPTAIN RAJU", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-08", "Bridge One", "Shahadat Hossain Bhuiyan", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-09", "Boathouse in Umngot River", "ANKAN", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-10", "Boats at Dawki River, Meghalaya", "Madhumita Das", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-11", "Clear Water of Umngot River", "ANKAN", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-12", "Dawki Bridge and Umngot River", "ANKAN", "CC BY-SA 4.0", "Jaflong"),
      commons("jaflong-13", "Canal of Ratargul Swamp Forest", "Anik Sarker", "CC BY-SA 4.0", "Ratargul"),
      commons("jaflong-14", "Canal of Ratargul Swamp Forest", "Anik Sarker", "CC BY-SA 4.0", "Ratargul"),
      commons("jaflong-15", "Entrance of Ratargul Swamp Forest", "Anik Sarker", "CC BY-SA 4.0", "Ratargul"),
      commons("jaflong-16", "Inside of Ratargul Swamp Forest", "Anik Sarker", "CC BY-SA 4.0", "Ratargul"),
    ],
    videos: [],
    highlights: ["Dawki river", "Khasi villages", "Ratargul swamp forest nearby"],
  },
  {
    name: "Sreemangal Tea Gardens",
    country: "Bangladesh",
    district: "Moulvibazar",
    status: "visited",
    visitedOn: new Date("2023-08-14"),
    featured: false,
    galleryLayout: "featured",
    summary: "The tea capital of Bangladesh - hills of terraced green in every direction.",
    images: [
      commons("sreemangal-01", "Sreemangal tea garden", "SP Suhag Debbarma", "CC BY-SA 4.0", "Tea gardens"),
      commons("sreemangal-02", "Sreemangal tea garden 2017-08", "Mar11", "CC BY-SA 4.0", "Tea gardens"),
      commons("sreemangal-03", "Tea Gardens of Sreemangal", "Radman Siddiki", "CC BY 4.0", "Tea gardens"),
      commons("sreemangal-04", "Girl at Zareen Tea Estate - Near Srimangal - Sylhet Division - Bangladesh", "Adam Jones", "CC BY-SA 2.0", "Tea gardens"),
      commons("sreemangal-05", "Girl at Zareen Tea Estate - Near Srimangal - Sylhet Division - Bangladesh", "Adam Jones", "CC BY-SA 2.0", "Tea gardens"),
      commons("sreemangal-06", "Panorama of Zareen Tea Estate - Near Srimangal - Sylhet Division - Bangladesh", "Adam Jones", "CC BY-SA 2.0", "Tea gardens"),
      commons("sreemangal-07", "Finlay Tea Garden, Srimongol", "Abu Sayeed", "CC BY-SA 4.0", "Tea gardens"),
      commons("sreemangal-08", "Hill of Tea garden", "Sujitpauldu", "CC BY-SA 4.0", "Tea gardens"),
      commons("sreemangal-09", "Tea-Girl statue, Satgaon Tea Estate, Sreemangal, Moulvibazar", "Ifteebd10", "CC BY-SA 4.0", "Tea gardens"),
      commons("sreemangal-10", "A train crossing through Lawachara National Park", "Kritzolina", "CC BY-SA 4.0", "Lawachara"),
      commons("sreemangal-11", "A train crossing through Lawachara National Park", "Kritzolina", "CC BY-SA 4.0", "Lawachara"),
      commons("sreemangal-12", "A train crossing through Lawachara National Park", "Kritzolina", "CC BY-SA 4.0", "Lawachara"),
      commons("sreemangal-13", "Blooming Nymphaea at Madhabpur", "Shutter Flora", "CC BY-SA 4.0", "Lawachara"),
      commons("sreemangal-14", "Lotus at Madhabpur Lake, Sylhet", "Zeesan R Chowdhury", "CC BY-SA 4.0", "Lawachara"),
      commons("sreemangal-15", "Madhabpur Lake, 12 Feb, 2011", "Mohammed Tawsif Salam", "CC BY-SA 3.0", "Lawachara"),
      commons("sreemangal-16", "Tea Gardens of Sreemangal", "Radman Siddiki", "CC BY 4.0", "Tea gardens"),
    ],
    videos: [],
    highlights: ["Seven layer tea", "Lawachara rainforest", "Madhabpur Lake"],
  },
  {
    name: "Nilgiri Hills",
    country: "Bangladesh",
    district: "Bandarban",
    status: "visited",
    visitedOn: new Date("2024-02-10"),
    featured: false,
    galleryLayout: "featured",
    summary: "One of the highest points in Bangladesh, usually above the cloud line.",
    images: [
      commons("nilgiri-01", "Nilgiri, Bandarban, Bangladesh", "Tanvir Rahat", "CC BY-SA 4.0", "Nilgiri"),
      commons("nilgiri-02", "Nilgiri, Bandarban, Bangladesh", "Tanvir Rahat", "CC BY-SA 4.0", "Nilgiri"),
      commons("nilgiri-03", "Nilgiri, Bandarban, Bangladesh", "Tanvir Rahat", "CC BY-SA 4.0", "Nilgiri"),
      commons("nilgiri-04", "Nilgiri, Bandarban, Bangladesh", "Tanvir Rahat", "CC BY-SA 4.0", "Nilgiri"),
      commons("nilgiri-05", "Banana plants at chimbuk hill, bandarban", "Ferdous", "CC BY-SA 3.0", "Nilgiri"),
      commons("nilgiri-06", "Nilgiri, Bandarban", "Sabilaenun", "CC BY-SA 3.0", "Nilgiri"),
      commons("nilgiri-07", "Chimbuk Hill", "Ringku Ps", "CC BY 3.0", "Nilgiri"),
      commons("nilgiri-08", "Chimbuk Parjatan, Bandarban", "Moheen Reeyad", "CC BY-SA 4.0", "Nilgiri"),
      commons("nilgiri-09", "Bandarban Nilachal Sunset", "Sourov0000", "CC BY-SA 3.0", "Nilgiri"),
      commons("nilgiri-10", "Nilgiri, Bandarban", "Nripo Khan", "CC BY-SA 4.0", "Nilgiri"),
      commons("nilgiri-11", "Nilachal, Bandarban", "Moheen Reeyad", "CC BY-SA 4.0", "Nilgiri"),
      commons("nilgiri-12", "Nilachal, Bandarban", "Moheen Reeyad", "CC BY-SA 4.0", "Nilgiri"),
      commons("nilgiri-13", "Bandarban Bangladesh", "RafidAlvi", "CC BY-SA 4.0", "Bandarban"),
      commons("nilgiri-14", "Bandarban Forest", "Jubersahel001", "CC BY-SA 4.0", "Bandarban"),
      commons("nilgiri-15", "Nilgiri, Bandarban", "Faisal Akram", "CC BY-SA 2.0", "Bandarban"),
      commons("nilgiri-16", "Bandarban Nilgiri Top View", "Sourov0000", "CC BY-SA 3.0", "Bandarban"),
    ],
    videos: [],
    highlights: ["Clouds below the road", "Nilachal viewpoint", "Chimbuk hill drive"],
  },
  {
    name: "Kaptai Lake",
    country: "Bangladesh",
    district: "Rangamati",
    status: "visited",
    visitedOn: new Date("2024-02-13"),
    featured: false,
    galleryLayout: "featured",
    summary: "The largest man-made lake in Bangladesh, ringed by hill tracts.",
    images: [
      commons("kaptai-01", "Aronnak Holiday Cottage, Rangamati", "Fahad Faisal", "CC BY-SA 4.0", "Kaptai"),
      commons("kaptai-02", "Bridge, Kaptai Lake", "Moheen Reeyad", "CC BY-SA 4.0", "Kaptai"),
      commons("kaptai-03", "Hanging Bridge, Kaptai Lake", "Shakhawat Hossen Shafat", "CC BY-SA 4.0", "Kaptai"),
      commons("kaptai-04", "Image of a moonlit night in kaptai lake", "Yasin Ahat", "CC BY-SA 4.0", "Kaptai"),
      commons("kaptai-05", "Bridge of Rangamati", "Touhidewu", "CC BY-SA 4.0", "Kaptai"),
      commons("kaptai-06", "A passenger boat in Kaptai Lake, Rangamati.", "Salim_Khandoker", "CC BY-SA 3.0", "Kaptai"),
      commons("kaptai-07", "Boat and kaptai lake, rangamati", "Ferdous", "CC BY-SA 4.0", "Kaptai"),
      commons("kaptai-08", "Hanging Bridge Rangamati", "Mahjuja Islam", "CC BY 4.0", "Kaptai"),
      commons("kaptai-09", "Beside Shuvolang Waterfall", "Salma Saba", "CC BY-SA 4.0", "Kaptai"),
      commons("kaptai-10", "Rangamati Shuvolong Waterfall natural Bangladesh", "Manna Barua", "CC0", "Kaptai"),
      commons("kaptai-11", "September 2025 view of Shuvolong Waterfalls", "Owais Al Qarni", "CC BY-SA 4.0", "Kaptai"),
      commons("kaptai-12", "September 2025 view of Shuvolong Waterfalls", "Owais Al Qarni", "CC BY-SA 4.0", "Kaptai"),
      commons("kaptai-13", "Hanging Bridge at Kaptai Lake", "Moheen Reeyad", "CC BY-SA 4.0", "Rangamati"),
      commons("kaptai-14", "Hanging Bridge at Kaptai Lake", "Moheen Reeyad", "CC BY-SA 4.0", "Rangamati"),
      commons("kaptai-15", "Hanging Bridge at Kaptai Lake", "Moheen Reeyad", "CC BY-SA 4.0", "Rangamati"),
      commons("kaptai-16", "Hanging Bridge at Kaptai Lake", "Moheen Reeyad", "CC BY-SA 4.0", "Rangamati"),
    ],
    videos: [],
    highlights: ["Hanging bridge", "Boat across the lake", "Shuvolong waterfall"],
  },
  {
    name: "Alutila Cave",
    country: "Bangladesh",
    district: "Khagrachhari",
    status: "visited",
    visitedOn: new Date("2024-02-16"),
    featured: false,
    galleryLayout: "duo",
    summary: "A pitch-dark natural cave walked by torchlight, high in the hill tracts.",
    images: [
      commons("alutila-01", "Alu Tila Guha khagrachari", "Mahjuja Islam", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-02", "Alutila, Khagrachhari", "Solayman .Emon", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-03", "Alutila, Khagrachhari", "Solayman .Emon", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-04", "Alutila Buddhist Pagoda", "Ankon Chakma", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-05", "Alutila Cave", "ANKAN GHOSH DASTIDER", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-06", "Alutila Hanging bridge", "Mahjuja Islam", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-07", "Matai Hakor cave of Alutila", "Zaheed Sarwer Khan", "CC BY 4.0", "Alutila"),
      commons("alutila-08", "On the Way to Alutila Cave", "ANKAN GHOSH DASTIDER", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-09", "Attracted by nature", "Mahjuja Islam", "CC0", "Khagrachhari"),
      commons("alutila-10", "On the Way to Alutila Cave", "ANKAN GHOSH DASTIDER", "CC BY-SA 4.0", "Khagrachhari"),
      commons("alutila-11", "Bazar road, Khagrachhari", "Salim Khandoker", "CC BY-SA 4.0", "Khagrachhari"),
      commons("alutila-12", "Hajachara Waterfall, Khagrachhari", "ANKAN GHOSH DASTIDER", "CC BY-SA 4.0", "Khagrachhari"),
      commons("alutila-13", "Alutila Tourist Resort at Khagrachari", "Raihan Rana", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-14", "Alutila at Khagrachari", "Raihan Rana", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-15", "Alutila cave", "Swarup Biswas 05", "CC BY-SA 4.0", "Alutila"),
      commons("alutila-16", "Alutila cave entrance", "Sahed Mustopha", "CC BY-SA 4.0", "Alutila"),
    ],
    videos: [],
    highlights: ["Torch-lit cave walk", "Richhang waterfall", "Hilltop viewpoint"],
  },
  {
    name: "Padma Garden & Varendra Museum",
    country: "Bangladesh",
    district: "Rajshahi",
    status: "visited",
    visitedOn: new Date("2022-11-05"),
    featured: false,
    galleryLayout: "tabs",
    summary: "The riverfront of the silk city, and the oldest museum in the country.",
    images: [
      commons("rajshahi-01", "Arabic-Parsian stone inscription of time of Shah Alam (II) at Varendra Research Museum", "Masum-al-hasan", "CC BY-SA 4.0", "Varendra Museum"),
      commons("rajshahi-02", "A Top View Of Bank Of Padma River", "Musfiq munna", "CC BY-SA 4.0", "Padma riverfront"),
      commons("rajshahi-03", "Varendra Research Museum, Rajshahi", "Nahid.rajbd", "CC BY-SA 4.0", "Varendra Museum"),
      commons("rajshahi-04", "Brahma, Prehistoric & Archeological Gallery, CUM", "Moheen Reeyad", "CC BY-SA 4.0", "Varendra Museum"),
      commons("rajshahi-05", "Shivs Nataraja", "Shariful iea", "CC BY-SA 3.0", "Varendra Museum"),
      commons("rajshahi-06", "Vishnu at Varendra Research Museum", "Masum-al-hasan", "CC BY-SA 4.0", "Varendra Museum"),
      commons("rajshahi-07", "Vishnu at Varendra Research Museum", "Masum-al-hasan", "CC BY-SA 4.0", "Varendra Museum"),
      commons("rajshahi-08", "বৌদ্ধ মূর্তি", "Shariful iea", "CC BY-SA 4.0", "Varendra Museum"),
      commons("rajshahi-09", "Life in Padma River, Rajshahi", "Nahid.rajbd", "CC BY-SA 4.0", "Padma riverfront"),
      commons("rajshahi-10", "Life in Padma River, Rajshahi", "Nahid.rajbd", "CC BY-SA 4.0", "Padma riverfront"),
      commons("rajshahi-11", "Life in Padma River, Rajshahi", "Nahid.rajbd", "CC BY-SA 4.0", "Padma riverfront"),
      commons("rajshahi-12", "Life in Padma River, Rajshahi", "Nahid.rajbd", "CC BY-SA 4.0", "Padma riverfront"),
      commons("rajshahi-13", "A view of Rajshahi city near Uposhohor", "Tawkir.ahmad", "CC BY-SA 4.0", "Padma riverfront"),
      commons("rajshahi-14", "Aerial view of rajshahi", "RockyMasum", "CC BY-SA 4.0", "Padma riverfront"),
      commons("rajshahi-15", "Bank Of Padma,Rajshahi", "Musfiq munna", "CC BY-SA 4.0", "Padma riverfront"),
      commons("rajshahi-16", "City hat bypass road, Rajshahi", "ইমন", "CC BY 4.0", "Padma riverfront"),
    ],
    videos: [],
    highlights: ["Padma riverbank", "Varendra Research Museum", "Rajshahi silk"],
  },

  {
    name: "Sajek Valley",
    country: "Bangladesh",
    district: "Rangamati",
    status: "visited",
    // Tail end of the Feb 2024 hill-tract trip, in through Khagrachhari.
    visitedOn: new Date("2024-02-18"),
    featured: false,
    galleryLayout: "featured",
    summary: "Cloud-covered valley in the hill tracts, reached through Khagrachhari.",
    images: [
      commons("sajek-01", "Amidst I Stand Alone (Sajek Valley)", "G.B. G.Son", "CC BY-SA 4.0", "Sajek"),
      commons("sajek-02", "Clouds at Sajek Valley", "Sahriar ahmed tasvir", "CC BY-SA 4.0", "Sajek"),
      commons("sajek-03", "Cloudy Sajek Valley", "Zohrakeya", "CC BY-SA 4.0", "Sajek"),
      commons("sajek-04", "Helipad, Sajek Valley", "Rocky Masum", "CC BY-SA 4.0", "Sajek"),
      commons("sajek-05", "Sajek Valley", "Solayman .Emon", "CC BY-SA 4.0", "Konglak hill"),
      commons("sajek-06", "Sajek Valley", "Solayman .Emon", "CC BY-SA 4.0", "Konglak hill"),
      commons("sajek-07", "Sajek Valley", "Solayman .Emon", "CC BY-SA 4.0", "Konglak hill"),
      commons("sajek-08", "Sajek Valley", "Solayman .Emon", "CC BY-SA 4.0", "Konglak hill"),
      commons("sajek-09", "A cottage at Sajek Valley", "Rocky Masum", "CC BY-SA 4.0", "Sajek"),
      commons("sajek-10", "Dawn sight of sajek", "খালিদ জে. হোসেইন", "CC BY-SA 4.0", "Sajek"),
      commons("sajek-11", "Hookah at Sajek Valley", "Rocky Masum", "CC BY-SA 4.0", "Sajek"),
      commons("sajek-12", "Konglak Hill 2 at Sajek;Rangamati;Bangladesh", "ইয়াছিন আরফাত মাক্কী", "CC BY-SA 4.0", "Konglak hill"),
      commons("sajek-13", "Chander Gari", "Biplobkgc", "CC BY-SA 3.0", "Sajek"),
      commons("sajek-14", "Before The Sunrise", "Arifgraphy", "CC BY-SA 3.0", "Sajek"),
      commons("sajek-15", "Sajek Valley, Rangamati,Bangladesh", "Anica Tabassum", "CC BY-SA 4.0", "Sajek"),
      commons("sajek-16", "Runmoy, Sajek Valley", "Rocky Masum", "CC BY-SA 4.0", "Sajek"),
    ],
    videos: [],
    highlights: ["Konglak hill", "Sunrise above the clouds"],
  },
  // Planned - so the "planned" half of the UI has something to render.
  {
    name: "Sixty Dome Mosque",
    country: "Bangladesh",
    district: "Bagerhat",
    status: "planned",
    featured: false,
    summary: "A 15th-century UNESCO World Heritage mosque in the Khulna division.",
    images: [],
    videos: [],
    highlights: ["UNESCO site", "Khan Jahan Ali architecture"],
  },
  {
    name: "Kantajew Temple",
    country: "Bangladesh",
    district: "Dinajpur",
    status: "visited",
    visitedOn: new Date("2026-09-04"),
    featured: false,
    galleryLayout: "masonry",
    summary: "An 18th-century terracotta temple, every surface carved.",
    images: [
      commons("kantajew-01", "কান্তনগর মন্দির", "Pinu Rahman", "CC BY-SA 4.0", "Temple"),
      commons("kantajew-02", "Kantajew Temple, Birgong, Dinajpur", "Tanvir Ahmed Seajar", "CC BY-SA 4.0", "Temple"),
      commons("kantajew-03", "Kantajew Temple, Dinajpur, Bangladesh, early 18th century", "Richard Mortel", "CC BY 4.0", "Temple"),
      commons("kantajew-04", "Kantajew Temple, Dinajpur, Bangladesh (isometric view)", "Md. Rifat Hasan Jihan", "CC BY-SA 4.0", "Temple"),
      commons("kantajew-05", "Kantajew Temple, Dinajpur, Bangladesh, early 18th century", "Richard Mortel", "CC BY 4.0", "Temple"),
      commons("kantajew-06", "Kantajew Temple, Dinajpur, Bangladesh, early 18th century", "Richard Mortel", "CC BY 4.0", "Temple"),
      commons("kantajew-07", "Kantaji Temple Dinajpur Bangladesh", "Shahnoor Habib Munmun", "CC BY 3.0", "Temple"),
      commons("kantajew-08", "Kantaji Temple Dinajpur Bangladesh", "Shahnoor Habib Munmun", "CC BY 3.0", "Temple"),
      commons("kantajew-09", "Kantajew Temple-Terracotta", "Shuvajit BD", "CC BY-SA 4.0", "Temple"),
      commons("kantajew-10", "Kantajew Temple-Terracotta (পোড়ামাটির ফলক)", "Shuvajit BD", "CC BY-SA 4.0", "Temple"),
      commons("kantajew-11", "Kantajew Temple-Terracotta", "Shuvajit BD", "CC BY-SA 4.0", "Temple"),
      commons("kantajew-12", "Kantaji's Temple", "Abuhena17", "CC BY-SA 4.0", "Temple"),
      commons("kantajew-13", "Dinajpur Rajbari", "Wiki Ruhan", "CC BY-SA 4.0", "Dinajpur"),
      commons("kantajew-14", "Dinajpur Rajbari", "Nasir Khan Saikat", "CC BY-SA 3.0", "Dinajpur"),
      commons("kantajew-15", "Dinajpur Rajbari", "Nasir Khan Saikat", "CC BY-SA 3.0", "Dinajpur"),
      commons("kantajew-16", "Dinajpur Rajbari", "Salim_Khandoker", "CC BY-SA 4.0", "Dinajpur"),
    ],
    videos: [],
    highlights: ["Terracotta panels", "Late Mughal era architecture"],
  },
  {
    name: "Tetulia & Kanchenjunga View",
    country: "Bangladesh",
    district: "Panchagarh",
    status: "planned",
    featured: false,
    summary: "The northernmost point of Bangladesh - Kanchenjunga is visible on clear winter mornings.",
    images: [],
    videos: [],
    highlights: ["Kanchenjunga on clear days", "Tea gardens of the north"],
  },
];

const blogs = [
  {
    title: "Why I moved from Ant Design to plain Tailwind",
    text: "Running a component library alongside Tailwind means two resets fighting each other and a CSS-in-JS runtime on every render. Rebuilding the handful of components I actually used - a drawer, an accordion, a toast and an inline nav - took an afternoon and removed 71 packages. The lesson: audit what you use before you add a dependency that ships everything.",
    image: "/images/tuitionMedia.png",
  },
  {
    title: "Aggregation pipelines that finally made sense",
    text: "$lookup felt impenetrable until I stopped thinking of it as a SQL join and started reading each stage as a transform on a stream of documents. Once the pipeline is a list of small, inspectable steps you can comment out one stage at a time and see exactly where the shape went wrong.",
    image: "/images/educational.png",
  },
  {
    title: "Refresh tokens without leaking them",
    text: "An access token in memory and a refresh token in an httpOnly cookie is the boring answer, and it is boring because it works. The part that took me longest was rotation: every refresh issues a new token and invalidates the old one, so a stolen token is useful exactly once.",
    image: "/images/jobPreparation.png",
  },
];

const run = async () => {
  if (!config.database_url) throw new Error("DATABASE_URL is not set");
  await mongoose.connect(config.database_url);
  console.log(`connected: ${config.database_url}`);

  await Promise.all([
    Skill.deleteMany({}),
    TravelPlace.deleteMany({}),
    TravelOverview.deleteMany({}),
    Experience.deleteMany({}),
    Projects.deleteMany({}),
    Blog.deleteMany({}),
    About.deleteMany({}),
    ExtraActivities.deleteMany({}),
    Achievement.deleteMany({}),
    SiteProfile.deleteMany({}),
  ]);

  await Skill.insertMany(skills);
  await TravelPlace.insertMany(travelPlaces);
  await TravelOverview.create({
    history:
      "I started travelling seriously while at university in Dinajpur, mostly by night bus and mostly on a student budget. So far that has meant the hill tracts, the tea country of Sylhet, and the long coast down to Saint Martin.",
    futurePlan:
      "The goal is all 63 districts of Bangladesh. After that, the northern border - Panchagarh and Tetulia in winter - and eventually somewhere outside the country.",
  });
  await Experience.insertMany(experiences);
  await Projects.insertMany(projects);
  await Blog.insertMany(blogs);

  // The single source of truth for identity. This replaced the `banner` and
  // `socialLink` collections, which each stored their own copy of the name,
  // portrait, tagline and social URLs while the frontend hardcoded a third.
  await SiteProfile.create({
    name: "Md. Nasir Uddin",
    headline: "Full Stack Developer",
    tagline:
      "MERN stack developer building production web applications with Next.js, Node.js and MongoDB. I care about shipping things that stay maintainable after launch.",
    bio: "I am a full stack developer from Dinajpur, Bangladesh, with a BBA in Finance and a self-taught path into web development. I work mostly across the MERN stack with TypeScript, and I enjoy the part of the job where a vague requirement turns into a schema that actually holds up.",
    // The published contact address, deliberately not the admin login email.
    email: "mdnasiruddin5201@gmail.com",
    phone: "+8801729678295",
    location: "Dinajpur, Bangladesh",
    avatar: "/images/Nasir-Graduation.jpg",
    // The hero crossfades between these two portraits.
    heroImages: [
      { url: "/images/Nasir-Graduation.jpg", alt: "Md. Nasir Uddin" },
      { url: "/images/Nasir-Portrait.jpg", alt: "Md. Nasir Uddin" },
    ],
    resumeUrl:
      "https://drive.google.com/uc?export=download&id=1BSH1hpXYoyyDKIpCDne_5BgWNZwRHDDV",
    socials: {
      github: "https://github.com/MohammadNasir520",
      linkedin: "https://www.linkedin.com/in/mdnasir-uddin/",
      facebook: "https://www.facebook.com/nasir.ahsan.520/",
      twitter: "",
      instagram: "",
      youtube: "",
    },
    metaTitle: "Nasir Uddin",
    metaDescription: "Nasir Uddins' Portfolio",
  });

  await About.create({
    title: "About Me",
    description:
      "I am a full stack developer from Dinajpur, Bangladesh, with a BBA in Finance and a self-taught path into web development. I work mostly across the MERN stack with TypeScript, and I enjoy the part of the job where a vague requirement turns into a schema that actually holds up.",
  });

  await ExtraActivities.insertMany([
    {
      title: "University Programming Club",
      image: "/images/hstuGate.jpg",
      description:
        "Ran weekly problem-solving sessions at HSTU, walking juniors through data structures and contest strategy.",
    },
    {
      title: "Open Source Contributions",
      image: "/images/Postgresql.png",
      description:
        "Small documentation and bug-fix PRs to Node.js tooling projects, mostly around clearer error messages.",
    },
    {
      title: "Travel and Photography",
      image: "/images/traveling/saintmartin1.jpg",
      description:
        "Exploring Bangladesh by road and camera, from Saint Martin's Island to the northern tea estates.",
    },
  ]);

  await Achievement.insertMany([
    {
      title: "Internship Completion Certificate - Q Startups Pvt. Ltd.",
      image: "/images/certificates/q-startups-internship.png",
      description:
        "Awarded for successfully completing an internship in Backend Development, 10 March to 18 April 2023.",
    },
    {
      title: "Complete Web Development Course",
      image: "/images/educational.png",
      description:
        "Finished a year-long MERN stack programme covering React, Node.js, MongoDB and deployment.",
    },
    {
      title: "Next Level Web Development",
      image: "/images/bookCenter.png",
      description:
        "Advanced track on TypeScript, Prisma, PostgreSQL and production-grade API design.",
    },
    {
      title: "Problem Solving Milestone",
      image: "/images/jobPreparation.png",
      description:
        "Solved 500+ algorithmic problems across competitive programming platforms.",
    },
  ]);

  // Upsert rather than wipe: never delete accounts that may already exist.
  const adminEmail = "admin@nasir.dev";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!(await User.findOne({ email: adminEmail }))) {
    if (!adminPassword) {
      throw new Error("SEED_ADMIN_PASSWORD is required to create the admin");
    }
    // Goes through User.create so the pre-save bcrypt hook runs.
    await User.create({
      name: "Md. Nasir Uddin",
      email: adminEmail,
      password: adminPassword,
      // super_admin, not admin: POST /admins and PATCH /admins/:id require it,
      // so a plain admin could never manage other accounts.
      role: ENUM_USER_ROLE.SUPER_ADMIN,
    });
    console.log(`admin created: ${adminEmail}`);
  } else {
    console.log(`admin already exists: ${adminEmail} (left untouched)`);
  }

  const counts = {
    skills: await Skill.countDocuments(),
    travelPlaces: await TravelPlace.countDocuments(),
    "travel(visited)": await TravelPlace.countDocuments({ status: "visited" }),
    experiences: await Experience.countDocuments(),
    projects: await Projects.countDocuments(),
    "projects(best)": await Projects.countDocuments({ level: "best" }),
    blogs: await Blog.countDocuments(),
    about: await About.countDocuments(),
    siteProfile: await SiteProfile.countDocuments(),
    extraActivities: await ExtraActivities.countDocuments(),
    achievements: await Achievement.countDocuments(),
    users: await User.countDocuments(),
  };
  console.table(counts);

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("seed failed:", error);
  process.exit(1);
});
