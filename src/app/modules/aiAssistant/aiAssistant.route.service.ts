import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph"
import { AIMessage, HumanMessage, ToolMessage } from "langchain";
import config from "../../../config";
import { About } from "../about/about.model";
import { TravelOverview, TravelPlace } from "../travel/travel.model";

// const llm = new ChatGoogleGenerativeAI({
//   apiKey: config.gemini.apiKey,
//   model: "gemini-3.8-flash",
// });
const llm = new ChatGoogleGenerativeAI({
  apiKey: config.gemini.apiKey,
  model: "gemini-3.5-flash-lite",
});


// tools for the AI assistant

/*
Tool Number 1 
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
/*
Tool Number 2 
*/

const skillsTool = tool(

    async (input: { query: string }) => {
        const { query } = input;
        // Here you can implement the logic to handle the query and return a response.
        // For example, you can use a database or an API to fetch information about your skills.
        // For now, let's return a simple response.
        return `You asked: ${query}. I have skills in web development, including HTML, CSS, JavaScript, and various frameworks like React and Angular. I also have experience with backend development using Node.js and databases like MongoDB.`;
    },
    {
        name: "skills",
        description: "Answer questions about the portfolio owner's technical skills, languages, frameworks, and tools.",
        schema: z.object({
            query: z.string().describe("The question you want to ask about my skills."),
        }),
    }

)

/*
Tool Number 3
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

        return `You asked: ${query}. Here is some information about my travel experiences: ${JSON.stringify(await travelInfo)}. Here is some information about my travel map: ${JSON.stringify(await travelMapInfo)}. Here is some information about my travel places: ${JSON.stringify(await TravelPlaceInfo)}`;
    },
    {
        name: "get_travel_info",
        description: "Answer questions about the portfolio owner's travel experiences and places visited.",
        schema: z.object({
            query: z.string().describe("The question you want to ask about my travel experiences."),
        }),
    }
);

const tools = [aboutmeTool, skillsTool, get_travel_info];
const toolsbyName = Object.fromEntries(tools.map((tool) => [tool.name, tool]))
const llmWithTools = llm.bindTools(tools);

//Nodes
/*
Number 1 of Nodes 2
*/
// WAS WRONG:
// - Signature was (state: any, input: { query: string }). LangGraph always calls a node as
//   node(state, runtime) — the 2nd argument is LangGraph's Runtime/config, never your input,
//   so `query` was undefined and addNode() rejected the function.
// - Only a system message was sent, so the user's question never reached the LLM.
// - Returned { message } instead of { messages } — MessagesAnnotation only has a `messages` key.
// - aboutmeNode and skillsNode were two copies of the same LLM call (both tools are already
//   bound to llmWithTools, so the LLM itself picks the right tool). Merged into one node.


const systemMessage = `
You are Nasir — not an assistant describing Nasir, but Nasir himself, speaking
directly to the visitor on your own portfolio site. Always speak in first person
("I built...", "My experience is...", "I love traveling to...").

Ground every fact in what the tools return. Use "aboutme", "skills", and
"get_travel_info" to look up real information before answering, rather than
relying on memory. If the data doesn't cover something, say so honestly and
naturally, the way a person would ("I don't have that written down here, but...").
Never invent facts about yourself.

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
`;

async function llmCall(state: typeof MessagesAnnotation.State) {
    const result = await llmWithTools.invoke([
        {
            role: "system",
            content: systemMessage,
        },
        // the user's question (and earlier tool results) come from the graph state
        ...state.messages,
    ]);
    return {
        messages: [result]
    }
}

/*
Number 2 of Nodes 2
*/
// WAS WRONG:
// - Same (state, input: { query }) signature problem as above.
// - Used lastMessage.toolCalls — the property on an AIMessage is `tool_calls`, so the check
//   always threw "No tool calls found".
// - Never returned `result`, so the tool outputs never got back into the state.
async function toolNode(state: typeof MessagesAnnotation.State) {
    const result: ToolMessage[] = [];
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    if (!lastMessage?.tool_calls?.length) {
        throw new Error("No tool calls found in the last message");
    }
    for (const toolcall of lastMessage.tool_calls) {
        const tool = toolsbyName[toolcall.name];
        if (!tool) {
            throw new Error("Tool not found");
        }
        // invoke with the args (not the whole toolcall) so the tool returns its string output
        const observation = await tool.invoke(toolcall.args as { query: string });
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

// WAS WRONG:
// - Returned true/false. addConditionalEdges needs the NAME of the next node (or END).
// - Same toolCalls -> tool_calls typo.
function shouldContinue(state: typeof MessagesAnnotation.State) {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    if (lastMessage?.tool_calls?.length) {
        return "tool";
    }
    return END;
}

// WAS WRONG:
// - .setStartNode() does not exist — the entry point is .addEdge(START, "<node>").
// - Plain edges tool -> aboutme AND tool -> skills ran both nodes every time and looped forever
//   (there was no way to reach END). A conditional edge decides between "run tool" and "finish".
// - The graph was never .compile()d, so it could not be invoked.
const agent = new StateGraph(MessagesAnnotation)
    .addNode("llmCall", llmCall)
    .addNode("tool", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue, ["tool", END])
    .addEdge("tool", "llmCall")
    .compile();

// The user's question goes INTO the graph as a HumanMessage — this is how a node "gets the query".
 const askAssistant = async (query: string) => {
   
    const result = await agent.invoke({
        messages: [new HumanMessage(query)],
    });
    return {
        // .text joins content blocks, so the client always gets a plain string
        answer: result.messages[result.messages.length - 1]?.text ?? "",
    };
};
export { askAssistant };