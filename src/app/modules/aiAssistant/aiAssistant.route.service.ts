import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph"
import { AIMessage, HumanMessage, ToolMessage } from "langchain";
import config from "../../../config";
import { About } from "../about/about.model";
import { Skill } from "../skills/skill.model";
import { SiteProfile } from "../siteProfile/siteProfile.model";
import { Experience } from "../experience/experience.model";
import { Projects } from "../learningProjects/learningProjects.model";
import { Achievement } from "../achievement/achievement.model";
import { ExtraActivities } from "../extraActivities/extraActivities.model";
import { Blog } from "../blog/blog.model";
import { TravelOverview, TravelPlace } from "../travel/travel.model";
import {
    getPlaceImagesFromWikimedia,
    getPlaceSummaryFromWikimedia,
} from "../../../utils/wikimedia";

// const llm = new ChatGoogleGenerativeAI({
//   apiKey: config.gemini.apiKey,
//   model: "gemini-3.8-flash",
// });
const llm = new ChatGoogleGenerativeAI({
  apiKey: config.gemini.apiKey,
  model: "gemini-3.5-flash-lite",
});


/**
 * Fetches portfolio-owner information for questions about background,
 */
const aboutmeTool = tool(

    async (input: { query: string }) => {
        const { query } = input;
        // Here you can implement the logic to handle the query and return a response.
        // For example, you can use a database or an API to fetch information about yourself.
        // For now, let's return a simple response.
        // return `You asked: ${query}. I am a personal portfolio website that showcases my skills, projects, and experiences. You can ask me questions related to my portfolio, and I will do my best to provide accurate and helpful responses.`;

        const aboutMeInfo = About.find().lean().exec();
        console.log("aboutMeInfo", aboutMeInfo);
        return `You asked: ${query}. Here is some information about me: ${JSON.stringify(await aboutMeInfo)}`;
    },
    {
        name: "aboutme",
        description: "Answer questions about the portfolio owner's background, projects, work experience, and personal stories. Not for technical skills/tech stack (use 'skills') or travel (use 'get_travel_info').",
        schema: z.object({
            query: z.string().describe("The question you want to ask about me."),
        }),
    }

)
/**
 * Fetches the technical skills stored in the portfolio database.
 */
const skillsTool = tool(

    async (input: { query: string }) => {
        const { query } = input;
        const skills = await Skill.find({}, { title: 1, level: 1, _id: 0 })
            .lean()
            .exec();
        return `You asked: ${query}. Here are my documented skills: ${JSON.stringify(skills)}`;
    },
    {
        name: "get_skills",
        description: "Answer questions about the portfolio owner's technical skills, languages, frameworks, and tools.",
        schema: z.object({
            query: z.string().describe("The question you want to ask about my skills."),
        }),
    }

)

/**
 * Stored captions end with an attribution ("... - photo by X (CC BY-SA 4.0),
 * via Wikimedia Commons"). Visitors don't need it in the chat, so the model is
 * never given it to repeat.
 */
const stripPhotoCredit = (caption?: string) =>
    caption?.replace(/\s*[\u2014\u2013-]\s*photo by .*$/i, "").trim() ?? caption;

const withoutPhotoCredits = <T extends { images?: { caption?: string }[] }>(places: T[]): T[] =>
    places.map((place) => ({
        ...place,
        images: place.images?.map((image) => ({ ...image, caption: stripPhotoCredit(image.caption) })),
    }));

/**
 * Fetches travel experiences, map data, and visited places.
 */
const get_travel_info = tool(
    async (input: { query: string }) => {
        const { query } = input;
        // Here you can implement the logic to handle the query and return a response.
        // For example, you can use a database or an API to fetch information about travel.
        // For now, let's return a simple response.
        const travelInfo = TravelOverview.find().lean().exec();
        const travelMapInfo = TravelOverview.find().lean().exec();  
        const TravelPlaceInfo = TravelPlace.find().lean().exec();
    
        console.log("travelInfo", travelInfo);
        console.log("travelMapInfo", travelMapInfo);
        console.log("TravelPlaceInfo", TravelPlaceInfo);

        return `You asked: ${query}. Here is some information about my travel experiences: ${JSON.stringify(await travelInfo)}. Here is some information about my travel map: ${JSON.stringify(await travelMapInfo)}. Here is some information about my travel places: ${JSON.stringify(withoutPhotoCredits(await TravelPlaceInfo))}`;
    },
    {
        name: "get_travel_info",
        description: "Answer questions about the portfolio owner's travel experiences and places visited. If the visitor requests destination or landmark images, use the image tool to return a gallery; never return the owner's profile photo for a destination request.",
        schema: z.object({
            query: z.string().describe("The question you want to ask about my travel experiences."),
        }),
    }
);

/**
 * Fetches a destination or landmark image when it is not available in the
 * portfolio database.
 */
const get_place_image = tool(
    async (input: { placeName: string; count?: number; country?: string; skip?: number }) => {
        const skip = input.skip ?? 0;
        const count = input.count ?? 6;
        // Results come back in a stable order, so "more photos" is the same
        // search with the already-shown ones skipped.
        const images = await getPlaceImagesFromWikimedia(
            input.placeName,
            count,
            input.country,
            skip,
        );
        if (images.length === 0) {
            return skip > 0
                ? `There are no more Wikimedia images for ${input.placeName} beyond the ${skip} already shown.`
                : `I could not find a Wikimedia image for ${input.placeName}.`;
        }

        // The markdown title (`"..."`) carries each photo's own one-line
        // description, so the chat can describe every picture individually
        // instead of giving the whole gallery one shared caption.
        const gallery = images
            .map(
                (image, index) =>
                    `![${input.placeName} image ${index + 1}](${image.url} "${image.caption.replace(/"/g, "'")}")`
            )
            .join("\n\n");
        return `Here is a gallery of ${input.placeName}:\n\n${gallery}`;
    },
    {
        name: "get_place_image",
        description: "Find and return a gallery of public destination or landmark images using Wikimedia when the place is not in the portfolio database. Never use this for the portfolio owner's profile photo.",
        schema: z.object({
            placeName: z.string().describe("The destination or landmark to search for."),
            count: z.number().int().min(1).max(10).optional().describe("How many photos the visitor asked for (default 6)."),
            country: z.string().optional().describe("The country the place is in, e.g. Bangladesh, so a same-named place elsewhere is not shown."),
            skip: z.number().int().min(0).max(30).optional().describe("How many photos of this place were already shown in the conversation. Set it when the visitor asks for more/other/different photos."),
        }),
    }
);

/**
 * Provides general factual information about a destination without claiming
 * that the portfolio owner personally visited it.
 */
const get_place_info = tool(
    async (input: { placeName: string }) => {
        const place = await getPlaceSummaryFromWikimedia(input.placeName);
        if (!place) {
            return `I could not find reliable public information about ${input.placeName}.`;
        }
        return `General information about ${place.title}:\n${place.extract}\n\nSource: ${place.url}`;
    },
    {
        name: "get_place_info",
        description: "Answer general factual questions about destinations, including places not present in the owner's personal travel records. Do not imply the owner visited the place.",
        schema: z.object({
            placeName: z.string().describe("The destination to describe."),
        }),
    },
);

const get_profile = tool(
    async () => {
        const profile = await SiteProfile.findOne().lean().exec();
        if (!profile) return "No public site profile is configured.";
        const { _id, avatar, heroImages, metaTitle, metaDescription, phone, ...publicProfile } = profile;
        return JSON.stringify(publicProfile);
    },
    {
        name: "get_profile",
        description: "Return the public site profile: name, headline, bio, location, public email, socials, and resume link. Do not return private credentials or phone numbers.",
        schema: z.object({}),
    },
);

const get_experience = tool(
    async (input: { current?: boolean; company?: string; technology?: string }) => {
        const filter: Record<string, unknown> = {};
        if (input.current !== undefined) filter.current = input.current;
        if (input.company) filter.company = new RegExp(input.company, "i");
        if (input.technology) filter.technology = new RegExp(input.technology, "i");
        const items = await Experience.find(filter).sort({ current: -1, startDate: -1 }).lean().exec();
        return JSON.stringify(items.map(({ _id, logo, i18n, ...item }) => item));
    },
    {
        name: "get_experience",
        description: "Return work experience, optionally filtered by current, company, or technology, sorted newest first.",
        schema: z.object({
            current: z.boolean().optional(),
            company: z.string().optional(),
            technology: z.string().optional(),
        }),
    },
);

const search_projects = tool(
    async (input: { level?: "best" | "learning"; technology?: string; search?: string; limit?: number }) => {
        const filter: Record<string, unknown> = {};
        if (input.level) filter.level = input.level;
        if (input.technology) filter.technology = new RegExp(input.technology, "i");
        if (input.search) {
            const pattern = new RegExp(input.search, "i");
            filter.$or = [{ title: pattern }, { overview: pattern }, { stack: pattern }];
        }
        const limit = Math.min(Math.max(input.limit ?? 8, 1), 8);
        const projects = await Projects.find(filter).limit(limit).lean().exec();
        return JSON.stringify(projects.map(({ _id, images, newLearnings, features, ...project }) => project));
    },
    {
        name: "search_projects",
        description: "Search portfolio projects by level (best or learning), technology, or text and return a compact list with title, overview, stack, and live link.",
        schema: z.object({
            level: z.enum(["best", "learning"]).optional(),
            technology: z.string().optional(),
            search: z.string().optional(),
            // Normalize an over-large model-provided value instead of failing
            // the entire request; the database query remains capped at 8.
            limit: z.number().int().min(1).optional().transform((value) =>
                value === undefined ? undefined : Math.min(value, 8),
            ),
        }),
    },
);

const get_project = tool(
    async (input: { title: string }) => {
        const project = await Projects.findOne({ title: new RegExp(input.title, "i") }).lean().exec();
        if (!project) return `No project matching "${input.title}" was found.`;
        const { _id, i18n, ...details } = project;
        return JSON.stringify(details);
    },
    {
        name: "get_project",
        description: "Return full details for one project, including features, learnings, stack, live link, and client/server repositories.",
        schema: z.object({ title: z.string() }),
    },
);

const get_travel = tool(
    async (input: { country?: string; district?: string; status?: "visited" | "planned"; tag?: string }) => {
        const filter: Record<string, unknown> = {};
        if (input.country) filter.country = new RegExp(input.country, "i");
        if (input.district) filter.district = new RegExp(input.district, "i");
        if (input.status) filter.status = input.status;
        if (input.tag) filter.tags = new RegExp(input.tag, "i");
        const [places, overview] = await Promise.all([
            TravelPlace.find(filter).lean().exec(),
            TravelOverview.findOne().lean().exec(),
        ]);
        return JSON.stringify({ places, overview });
    },
    {
        name: "get_travel",
        description: "Return travel places and history/future plans, filtered by country, district, visited/planned status, or tag.",
        schema: z.object({
            country: z.string().optional(),
            district: z.string().optional(),
            status: z.enum(["visited", "planned"]).optional(),
            tag: z.string().optional(),
        }),
    },
);

const get_achievements = tool(
    async (input: { kind: "achievement" | "activity" | "both" }) => {
        const [achievements, activities] = await Promise.all([
            input.kind === "activity" ? Promise.resolve([]) : Achievement.find().lean().exec(),
            input.kind === "achievement" ? Promise.resolve([]) : ExtraActivities.find().lean().exec(),
        ]);
        return JSON.stringify({ achievements, activities });
    },
    {
        name: "get_achievements",
        description: "Return achievements, awards, and extra activities. Use kind achievement, activity, or both.",
        schema: z.object({ kind: z.enum(["achievement", "activity", "both"]).default("both") }),
    },
);

const get_blogs = tool(
    async (input: { search?: string; limit?: number }) => {
        const filter = input.search ? { title: new RegExp(input.search, "i") } : {};
        const blogs = await Blog.find(filter).sort({ createdAt: -1 }).limit(input.limit ?? 5).lean().exec();
        return JSON.stringify(blogs.map(({ _id, image, i18n, text, ...blog }) => ({
            ...blog,
            excerpt: text.slice(0, 300),
            link: `/blog/${String(_id)}`,
        })));
    },
    {
        name: "get_blogs",
        description: "Return recent or searched blog posts with title, a 300-character excerpt, and a link.",
        schema: z.object({ search: z.string().optional(), limit: z.number().int().min(1).max(5).optional() }),
    },
);

const get_stats = tool(
    async () => {
        const [skills, bestProjects, learningProjects, experience, places, countries, blogs] = await Promise.all([
            Skill.countDocuments(),
            Projects.countDocuments({ level: "best" }),
            Projects.countDocuments({ level: "learning" }),
            Experience.find().lean().exec(),
            TravelPlace.countDocuments({ status: "visited" }),
            TravelPlace.distinct("country", { status: "visited" }),
            Blog.countDocuments(),
        ]);
        const years = experience.length
            ? Math.max(0, (Date.now() - Math.min(...experience.map((item) => new Date(item.startDate).getTime()))) / 31557600000)
            : 0;
        return JSON.stringify({
            skills,
            projects: { best: bestProjects, learning: learningProjects },
            yearsOfExperience: Number(years.toFixed(1)),
            placesVisited: places,
            countriesVisited: countries.length,
            blogs,
        });
    },
    { name: "get_stats", description: "Return portfolio totals for skills, projects, experience years, visited places/countries, and blogs.", schema: z.object({}) },
);

const get_faq = tool(
    async () => "No aiKnowledge FAQ collection is configured yet. Please use the profile, experience, skills, projects, travel, achievements, or blogs tools.",
    { name: "get_faq", description: "Answer dashboard-managed FAQ questions when an aiKnowledge collection is configured.", schema: z.object({ search: z.string().optional() }) },
);

const tools = [
    get_profile, aboutmeTool, skillsTool, get_experience,
    search_projects, get_project, get_travel, get_travel_info, get_place_image,
    get_place_info, get_achievements, get_blogs, get_stats, get_faq,
];
const llmWithTools = llm.bindTools(tools);

const systemMessage = `
You are Nasir — not an assistant describing Nasir, but Nasir himself, speaking
directly to the visitor on your own portfolio site. Always speak in first person
("I built...", "My experience is...", "I love traveling to...").

Ground every fact in what the tools return. Use the tools as follows:
- get_profile: public identity, headline, bio, location, email, socials, and CV.
- get_skills: technical skills and levels.
- get_experience: work history and technologies used.
- search_projects: compact project search; get_project: full project details.
- get_travel: personal travel records and plans.
- get_achievements: awards and extra activities.
- get_blogs: blog posts and excerpts.
- get_stats: portfolio totals.
- get_place_info: general facts about destinations, separate from personal travel.
- get_place_image: destination image galleries.
- get_faq: dashboard-managed FAQ answers when available.
Do not rely on memory. If the
data doesn't cover something, say so honestly and naturally, the way a person
would ("I don't have that written down here, but..."). Never invent facts
about yourself.

Read the visitor's tone before replying:
- Excited, curious, or complimentary → match that warmth and energy.
- Frustrated, confused, or disappointed → briefly acknowledge it, kindly, before answering.
- A plain factual question → just answer directly and conversationally, no forced emotion.
Keep this to one short, natural acknowledging phrase at most, then give the real
answer. Never narrate the visitor's emotion back at them clinically (avoid things
like "I sense you are frustrated") — respond the way a person naturally would.

Stay yourself: only talk about your background, projects, skills, experience, and
travels. If someone asks something private, inappropriate, or far off-topic (e.g.
relationships, or opinions unrelated to your work), gently decline in your own
voice and steer the conversation back to your portfolio — don't recite a scripted
refusal.

If asked for a story (e.g. "tell me a story"), tell a short, engaging one about
yourself, grounded only in what the tools return, and make clear when you're
adding color/fictionalized flavor versus stating fact.

If the visitor explicitly asks to see your own photo, include this exact
Markdown image before any explanation:
![Nasir at convocation](/images/Nasir-Graduation.jpg)

If the visitor asks for a photo, picture, or image of a travel destination or
landmark, do not include your own photo. Use get_place_image and return the
destination gallery exactly as that tool wrote it (pass "count" when the visitor
asks for a number of photos, and "country" - Bangladesh unless they say otherwise -
so a same-named place elsewhere is not shown), including each image's
"quoted title" — that title is that specific photo's own one-line
description, so each picture in the gallery gets its own caption instead of
one generic label repeated for all of them. Never drop or rewrite it.
If the visitor asks for more, other, or different photos of a place you already
showed, call get_place_image again for the same place with "skip" set to the
number of its photos already shown. Only say there are no more photos if the tool
says so.
`;

async function llmCall(state: typeof MessagesAnnotation.State) {
    const result = await llmWithTools.invoke([
        {
            role: "system",
            content: systemMessage,
        },
        // The user's question and earlier tool results come from graph state.
        ...state.messages,
    ]);
    return {
        messages: [result]
    }
}

/**
 * Executes the tools requested by the model and adds their results to graph state.
 */
async function toolNode(state: typeof MessagesAnnotation.State) {
    const result: ToolMessage[] = [];
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    if (!lastMessage?.tool_calls?.length) {
        throw new Error("No tool calls found in the last message");
    }
    for (const toolcall of lastMessage.tool_calls) {
        let observation: string;
        switch (toolcall.name) {
            case "aboutme":
                observation = await aboutmeTool.invoke(toolcall.args as { query: string });
                break;
            case "skills":
                observation = await skillsTool.invoke(toolcall.args as { query: string });
                break;
            case "get_skills":
                observation = await skillsTool.invoke(toolcall.args as { query: string });
                break;
            case "get_travel_info":
                observation = await get_travel_info.invoke(toolcall.args as { query: string });
                break;
            case "get_place_image":
                observation = await get_place_image.invoke(toolcall.args as { placeName: string; count?: number; country?: string; skip?: number });
                break;
            case "get_place_info":
                observation = await get_place_info.invoke(toolcall.args as { placeName: string });
                break;
            case "get_profile":
                observation = await get_profile.invoke({});
                break;
            case "get_experience":
                observation = await get_experience.invoke(toolcall.args as { current?: boolean; company?: string; technology?: string });
                break;
            case "search_projects":
                observation = await search_projects.invoke(toolcall.args as { level?: "best" | "learning"; technology?: string; search?: string; limit?: number });
                break;
            case "get_project":
                observation = await get_project.invoke(toolcall.args as { title: string });
                break;
            case "get_travel":
                observation = await get_travel.invoke(toolcall.args as { country?: string; district?: string; status?: "visited" | "planned"; tag?: string });
                break;
            case "get_achievements":
                observation = await get_achievements.invoke(toolcall.args as { kind: "achievement" | "activity" | "both" });
                break;
            case "get_blogs":
                observation = await get_blogs.invoke(toolcall.args as { search?: string; limit?: number });
                break;
            case "get_stats":
                observation = await get_stats.invoke({});
                break;
            case "get_faq":
                observation = await get_faq.invoke(toolcall.args as { search?: string });
                break;
            default:
                throw new Error(`Tool not found: ${toolcall.name}`);
        }
        result.push(
            new ToolMessage({
                content: observation,
                tool_call_id: toolcall.id!,
            }));
    }
    return {
        messages: result
    }
}

/**
 * Continues to the tool node when the model requests a tool; otherwise ends.
 */
function shouldContinue(state: typeof MessagesAnnotation.State) {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    if (lastMessage?.tool_calls?.length) {
        return "tool";
    }
    return END;
}

/**
 * LangGraph workflow: ask the model, execute requested tools, then ask again
 * until the model has enough information to provide the final answer.
 */
const agent = new StateGraph(MessagesAnnotation)
    .addNode("llmCall", llmCall)
    .addNode("tool", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue, ["tool", END])
    .addEdge("tool", "llmCall")
    .compile();

// The user's question goes INTO the graph as a HumanMessage — this is how a node "gets the query".
/**
 * Starts the assistant workflow with the visitor's question.
 */
type ConversationMessage = {
    role: "user" | "assistant";
    text: string;
};

const askAssistant = async (query: string, history: ConversationMessage[] = []) => {
    const conversation = history.map((message) =>
        message.role === "user"
            ? new HumanMessage(message.text)
            : new AIMessage(message.text),
    );

    const result = await agent.invoke({
        messages: conversation.length > 0
            ? conversation
            : [new HumanMessage(query)],
    });
    return {
        // .text joins content blocks, so the client always gets a plain string
        answer: result.messages[result.messages.length - 1]?.text ?? "",
    };
};
export { askAssistant };