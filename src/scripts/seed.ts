/**
 * Seeds the local portfolio database with demo content.
 *
 *   npm run seed -- --merge   # add missing seed data, never deletes (safe on live DB)
 *   npm run seed              # wipe the seeded collections and re-insert (local DB only)
 *   npm run seed -- --force   # wipe + reseed even a remote DB
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
    overview: "A tuition marketplace where parents post tuition jobs (class, subject, schedule, salary, preferred tutor gender, home or online) and users browse, book, cart and review tutoring services. Admin and super-admin dashboards manage users, services, bookings and tuition posts.",
    stack: "FullStack",
    newLearnings: "Relational modelling with Prisma on PostgreSQL, JWT role-guard middleware with Zod validation, email verification with Nodemailer, and RTK Query with a custom axios baseQuery and cache tags in the Next.js App Router.",
    liveLink: "https://tuitionmedia.vercel.app",
    clientLink: "https://github.com/MohammadNasir520/Tution-service-frontend",
    serverLink: "https://github.com/MohammadNasir520/tution-service-backend",
    images: [
      {
        url: "/images/tuitionMedia.png"
      }
    ],
    technology: [
      "Next.js",
      "Typescript",
      "Redux",
      "Ant Design",
      "Tailwind",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Prisma",
      "JWT"
    ],
    features: [
      "Email-verified signup: a JWT verification link is sent with Nodemailer and the account is created on confirmation",
      "Role-based access for super admin, admin, user, parents and tutor, with role-specific dashboards",
      "Parents post and manage tuition jobs; admins create, edit and review them",
      "Service catalog with search, price range filter, sorting, pagination and category/status filters",
      "Service booking with time slots, booking and payment status, a cart, and star-rated reviews",
      "Admin-managed FAQ and Latest Updates content on public pages"
    ]
  },
  {
    level: "best",
    title: "Book Center",
    overview: "A book catalog where signed-in users add books with cover images, search and filter by genre and publication year, review books, and keep a personal reading wishlist with status tracking.",
    stack: "FullStack",
    newLearnings: "RTK Query with tag-based cache invalidation, Mongoose models with ObjectId refs and a bcrypt pre-save hook, JWT access/refresh tokens, Zod request validation, and third-party image upload from a Vite + React Router app.",
    liveLink: "",
    clientLink: "https://github.com/MohammadNasir520/BookCenter_React_Redux",
    serverLink: "https://github.com/MohammadNasir520/BookCenter_React_Redux_Server",
    images: [
      {
        url: "/images/bookCenter.png"
      }
    ],
    technology: [
      "React.js",
      "Typescript",
      "Redux",
      "Tailwind",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "JWT",
      "Zod"
    ],
    features: [
      "Signup and login with bcrypt-hashed passwords and JWT access/refresh tokens",
      "Add and edit books with cover images uploaded to ImgBB, behind a private route",
      "Search by title, author or genre, with genre and publication-year filters built from existing books",
      "Book reviews on the book details page",
      "Reading wishlist with status tracking: not read, reading, finished",
      "Edit and delete controls shown only to the book's creator"
    ]
  },
  {
    level: "best",
    title: "Job Preparation Hub",
    overview: "A course showcase for Bangladeshi job-exam preparation such as BCS. Courses are served by a small Express API; users browse courses by category, download course details as a PDF, and sign in to reach a protected checkout page.",
    stack: "FullStack",
    newLearnings: "Firebase Auth with multiple social providers through a React Context provider, React Router v6.4 loaders and protected routes, client-side PDF generation, and a minimal Express API deployed on Vercel.",
    liveLink: "https://job-preparation-20980.web.app",
    clientLink: "https://github.com/MohammadNasir520/job-preparation-client-side",
    serverLink: "https://github.com/MohammadNasir520/job-preparation-server-side",
    images: [
      {
        url: "/images/jobPreparation.png"
      }
    ],
    technology: [
      "React.js",
      "JavaScript",
      "Firebase",
      "Bootstrap",
      "React Bootstrap",
      "React Router",
      "Node.js",
      "Express.js"
    ],
    features: [
      "Firebase Authentication with email/password, Google and GitHub sign-in",
      "Private route protecting the course checkout page",
      "Course listing with a category side nav and details pages loaded via React Router loaders",
      "Download course details as a PDF",
      "Express REST API serving course and checkout data",
      "Blog and FAQ pages"
    ]
  },
  {
    level: "best",
    title: "Online Newspaper",
    overview: "A news portal that loads categories from a public news API, lists each category's articles sorted by views, and shows full article details in a modal.",
    stack: "Frontend",
    newLearnings: "Vanilla JavaScript DOM manipulation, chained fetch calls against a third-party API, client-side sorting, and Bootstrap modals and spinners without a framework.",
    liveLink: "",
    clientLink: "https://github.com/MohammadNasir520/Online-News-Paper",
    images: [
      {
        url: "/images/onlineNewsPaper.png"
      }
    ],
    technology: [
      "JavaScript",
      "HTML5",
      "CSS3",
      "Bootstrap",
      "Font Awesome"
    ],
    features: [
      "News categories loaded dynamically from a REST API",
      "Per-category article list with a count of items found",
      "Articles sorted by total views, highest first",
      "Article details modal with author, views, rating and badge",
      "Loading spinner, empty-category warning and fallbacks for missing data",
      "Separate blog page"
    ]
  },
  {
    level: "learning",
    title: "TV Shop",
    overview: "A second-hand TV marketplace where buyers browse TVs by category and book them, sellers list and advertise TVs, and an admin manages sellers and buyers, with Stripe card payments for bookings.",
    stack: "FullStack",
    newLearnings: "Firebase auth with React Context and private routes, role-based dashboard menus, React Router v6 loaders, and a Stripe PaymentIntent flow backed by an Express + MongoDB API.",
    liveLink: "https://sell-your-tv.web.app",
    clientLink: "https://github.com/MohammadNasir520/TV-Shop-Client",
    serverLink: "https://github.com/MohammadNasir520/TV-Shop-Server",
    images: [
      {
        url: "/images/tvshop.png"
      }
    ],
    technology: [
      "React.js",
      "JavaScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Firebase",
      "Tailwind",
      "DaisyUI",
      "Stripe",
      "TanStack Query"
    ],
    features: [
      "Firebase email/password and Google sign-in with Buyer or Seller role chosen at signup",
      "Browse TVs by category and book one through a modal form; buyers track bookings in My Orders",
      "Sellers add, delete and advertise their TVs; advertised TVs appear on the home page",
      "Admin dashboard to list and remove sellers and buyers and verify sellers",
      "Stripe checkout with a server-created PaymentIntent that marks the booking as paid"
    ]
  },
  {
    level: "learning",
    title: "World Cup Web",
    overview: "A responsive two-page fan site for the FIFA World Cup 2022 in Qatar, with a hero banner, a grid of football transfer news, and an upcoming-matches page, built from a Figma design.",
    stack: "Frontend",
    newLearnings: "Hand-written CSS Grid and Flexbox layouts with media-query breakpoints, translated from a Figma design with desktop, tablet and mobile mockups.",
    liveLink: "https://mohammadnasir520.github.io/world-cup/",
    clientLink: "https://github.com/MohammadNasir520/world-cup",
    images: [
      {
        url: "/images/worldCupWeb.png"
      }
    ],
    technology: [
      "HTML5",
      "CSS3",
      "Font Awesome"
    ],
    features: [
      "Hero banner with a call-to-action button",
      "News grid of transfer article cards with category tag, time posted and comment count",
      "Upcoming Match page with fixture cards showing both team flags and kick-off date",
      "Responsive CSS Grid layout for mobile, tablet and desktop",
      "Footer with links and social icons"
    ]
  },
  {
    level: "learning",
    title: "Donate Today",
    overview: "A landing page for a flood-relief donation campaign in Sylhet and Sunamganj, Bangladesh, with preset donation amounts, the donation plan, team profiles and an email subscribe section, built from a Figma design.",
    stack: "Frontend",
    newLearnings: "Flexbox-based section layouts and multi-font typography, translated pixel-by-pixel from a Figma design.",
    liveLink: "https://mohammadnasir520.github.io/donate-today-final/",
    clientLink: "https://github.com/MohammadNasir520/donate-today-final",
    images: [
      {
        url: "/images/donateTody.png"
      }
    ],
    technology: [
      "HTML5",
      "CSS3",
      "Google Fonts"
    ],
    features: [
      "Hero section about the flood with a Donate Now call-to-action",
      "Preset donation amount tiles (100tk to 5000tk) plus a custom amount field",
      "Donation plan cards: food, shelter and education",
      "Team profile cards with photos, short bios and Facebook links",
      "Email subscribe section"
    ]
  },
  {
    level: "learning",
    title: "Educational Portal",
    overview: "A Bootstrap 5 landing page for an online course provider, with a hero carousel, popular course cards with prices, a registration modal, student success stories, an FAQ accordion and a course list page.",
    stack: "Frontend",
    newLearnings: "Bootstrap 5's responsive grid and utilities, and its JavaScript components (carousel, collapse, modal, accordion) driven entirely by data attributes.",
    liveLink: "https://mohammadnasir520.github.io/Educational-website/",
    clientLink: "https://github.com/MohammadNasir520/Educational-website",
    images: [
      {
        url: "/images/educational.png"
      }
    ],
    technology: [
      "HTML5",
      "CSS3",
      "Bootstrap",
      "Font Awesome"
    ],
    features: [
      "Fixed responsive navbar that collapses into a hamburger menu on small screens",
      "Auto-playing hero carousel with captions and controls",
      "Grid of course cards with prices plus a separate course list page",
      "Registration modal opened from the Ready to join banner",
      "FAQ accordion and successful-student cards in a responsive grid"
    ]
  },
  {
    level: "learning",
    title: "Daily Routine Tracker",
    overview: "A React exercise planner: add activities from a set of exercise cards, see your total exercise time add up in a side panel, pick a break duration that persists across reloads, and mark the day complete.",
    stack: "Frontend",
    newLearnings: "React fundamentals: lifting state and passing callbacks between components, useState and useEffect, persisting data in localStorage, and integrating a third-party toast library.",
    liveLink: "",
    clientLink: "https://github.com/MohammadNasir520/Daily-Work-Routine",
    images: [
      {
        url: "/images/dayliroutine.png"
      }
    ],
    technology: [
      "React.js",
      "JavaScript",
      "CSS3",
      "React Toastify"
    ],
    features: [
      "Exercise activity cards rendered from data, each with an Add to list button",
      "Running total of exercise time shared between components via state and props",
      "Break-time selector saved to localStorage and restored on reload",
      "Activity Completed button with a toast notification",
      "Responsive layout with a sticky profile side panel"
    ]
  },
  {
    level: "learning",
    title: "Social Media App",
    overview: "A social media app where users sign up with email or Google, create text and image posts, react to and comment on posts, and edit their profile. A React + Vite client talks to a TypeScript Express and Mongoose REST API.",
    stack: "FullStack",
    newLearnings: "A modular TypeScript Express architecture (route, controller, service and model per module), Mongoose refs with populate, a reusable pagination and sorting helper, and Firebase auth on the client.",
    liveLink: "",
    clientLink: "https://github.com/MohammadNasir520/social_media_app_frontend",
    serverLink: "https://github.com/MohammadNasir520/social_media_app_backend",
    images: [
      {
        url: "/images/socialMedia.png"
      }
    ],
    technology: [
      "React.js",
      "Typescript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "Firebase",
      "Tailwind",
      "Vite"
    ],
    features: [
      "Firebase email/password and Google sign-in, with users saved to MongoDB",
      "Create posts with text and an image uploaded to ImgBB",
      "Like and love reactions, one per user per post",
      "Comments on posts, shown on a post details page",
      "Top posts by reactions on the home page and a newest-first media feed, via a paginated, sortable API",
      "Protected profile page to view and edit name, photo, university and address"
    ]
  }
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
  // Never print credentials: show the host only.
  const host = config.database_url.replace(/^mongodb(\+srv)?:\/\/([^@]*@)?/, "").split(/[/?]/)[0];
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  // The full seed wipes ten collections. Against a remote (i.e. live) database
  // that needs an explicit --force; --merge is non-destructive and always allowed.
  if (!MERGE && !isLocal && !process.argv.includes("--force")) {
    throw new Error(
      `refusing to wipe remote database ${host}. Use --merge to add missing seed data, or --force to wipe and reseed.`
    );
  }
  await mongoose.connect(config.database_url);
  console.log(`connected: ${host}${MERGE ? " (merge mode)" : ""}`);

  if (MERGE) {
    await merge();
    await mongoose.disconnect();
    return;
  }

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
  await SiteProfile.create(siteProfile);

  await About.create(about);
  await ExtraActivities.insertMany(extraActivities);
  await Achievement.insertMany(achievements);
  await ensureAdmin();
  await printCounts();
  await mongoose.disconnect();
};

/**
 * `npm run seed -- --merge`: add whatever seed content is missing without
 * deleting or overwriting anything. List items are matched by their natural
 * key (title / name / company); singletons are only created when absent.
 */
const MERGE = process.argv.includes("--merge");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const insertMissing = async (label: string, model: any, docs: any[], key: string) => {
  const existing = new Set(
    (await model.find({}, { [key]: 1 }).lean()).map((d: Record<string, unknown>) => d[key]),
  );
  const missing = docs.filter((d) => !existing.has(d[key]));
  if (missing.length) await model.insertMany(missing);
  console.log(`${label}: +${missing.length} (${docs.length - missing.length} already present)`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createIfAbsent = async (label: string, model: any, doc: object) => {
  if (await model.exists({})) return console.log(`${label}: already present (left untouched)`);
  await model.create(doc);
  console.log(`${label}: created`);
};

const merge = async () => {
  await insertMissing("skills", Skill, skills, "title");
  await insertMissing("travelPlaces", TravelPlace, travelPlaces, "name");
  await createIfAbsent("travelOverview", TravelOverview, travelOverview);
  await insertMissing("experiences", Experience, experiences, "company");
  await insertMissing("projects", Projects, projects, "title");
  await insertMissing("blogs", Blog, blogs, "title");
  await createIfAbsent("siteProfile", SiteProfile, siteProfile);
  await createIfAbsent("about", About, about);
  await insertMissing("extraActivities", ExtraActivities, extraActivities, "title");
  await insertMissing("achievements", Achievement, achievements, "title");
  await ensureAdmin();
  await printCounts();
};

const travelOverview = {
  history:
    "I started travelling seriously while at university in Dinajpur, mostly by night bus and mostly on a student budget. So far that has meant the hill tracts, the tea country of Sylhet, and the long coast down to Saint Martin.",
  futurePlan:
    "The goal is all 63 districts of Bangladesh. After that, the northern border - Panchagarh and Tetulia in winter - and eventually somewhere outside the country.",
};

const siteProfile = {
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
    metaTitle: "Md. Nasir Uddin",
    metaDescription:
      "Md. Nasir Uddin is a full stack MERN developer from Dinajpur, Bangladesh. Explore his projects, articles and travels.",
};

const about = {
    title: "About Me",
    description:
      "I am a full stack developer from Dinajpur, Bangladesh, with a BBA in Finance and a self-taught path into web development. I work mostly across the MERN stack with TypeScript, and I enjoy the part of the job where a vague requirement turns into a schema that actually holds up.",
};

const extraActivities = [
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
];

const achievements = [
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
];

const ensureAdmin = async () => {
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
};

const printCounts = async () => {
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
};

run().catch((error) => {
  console.error("seed failed:", error);
  process.exit(1);
});
