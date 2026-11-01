import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

import {MessagesAnnotation,StateGraph} from "@langchain/langgraph"
import { ToolMessage } from "langchain";

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
});

// tools for the AI assistant

/*
Number 1 of tools 2
*/
const aboutmeTool = tool(

    async (input: { query: string }) => {
        const { query } = input;
        // Here you can implement the logic to handle the query and return a response.
        // For example, you can use a database or an API to fetch information about yourself.
        // For now, let's return a simple response.
        return `You asked: ${query}. I am a personal portfolio website that showcases my skills, projects, and experiences. You can ask me questions related to my portfolio, and I will do my best to provide accurate and helpful responses.`;
    },
    {
        name: "aboutme",
        description: "This tool is used to answer questions about me, my skills, projects, and experiences.",
        schema: z.object({
            query: z.string().describe("The question you want to ask about me."),
        }),
    }

)
/*
Number 2 of tools 2
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
        description: "This tool is used to answer questions about my skills.",
        schema: z.object({
            query: z.string().describe("The question you want to ask about my skills."),
        }),
    }

)

const tools = [aboutmeTool, skillsTool];
const toolsbyName = Object.fromEntries(tools.map((tool) => [tool.name, tool]))
const llmWithTools = llm.bindTools(tools);

//Nodes
/*
Number 1 of Nodes 2
*/

async function aboutmeNode(state: any, input: { query: string }) {
    const { query } = input;
    const tool = toolsbyName["aboutme"];
    if (!tool) {
        throw new Error("Tool not found");
    }
    const result = await llmWithTools.invoke([{
        role: "system",
        content: `You are a helpful assistant that answers questions about me, my skills, projects, and experiences. You have access to the following tool: ${tool.name}. Use this tool to answer questions related to me.`
    }]);
    return {
        message: [result]
    }
}

/*
Number 2 of Nodes 2
*/

async function skillsNode(state: any, input: { query: string }) {
    const { query } = input;
    const tool = toolsbyName["skills"];
    if (!tool) {
        throw new Error("Tool not found");
    }
    const result = await llmWithTools.invoke([{
        role: "system",
        content: `You are a helpful assistant that answers questions about my skills. You have access to the following tool: ${tool.name}. Use this tool to answer questions related to my skills.`
    }])
     return {
        message: [result]
    }}
/*
Number 3 of Nodes 2
*/
async function toolNode(state: any, input: { query: string }) {
    const { query } = input;
    //perform the tool call based on the query
 const    result: ToolMessage[]=[],
 lastMessage = state.messages[state.messages.length - 1];
 if (!lastMessage || !lastMessage.toolCalls) {
    throw new Error("No tool calls found in the last message");
}
 for (const toolcall of lastMessage.toolCalls) {    
    const tool = toolsbyName[toolcall.name];
    if (!tool) {
        throw new Error("Tool not found");
    }
    const observation = await tool.invoke(toolcall.args as { query: string });
    result.push(
        new ToolMessage({
        content: observation,
        tool_call_id: toolcall.id,
    }));
}
}

function shoudContinue(state: any) {
    const lastMessage = state.messages[state.messages.length - 1];
    if (!lastMessage) {
        return false;
    }
    if (lastMessage.toolCalls && lastMessage.toolCalls.length > 0) {
        return true;
    }
    return false;
}

const agentbuilder = new StateGraph(MessagesAnnotation).addNode("aboutme", aboutmeNode)
.addNode("skills", skillsNode)
.addNode("tool", toolNode)
.addEdge("aboutme", "tool")
.addEdge("skills", "tool")
.addEdge("tool", "aboutme")
.addEdge("tool", "skills")
.setStartNode("aboutme");