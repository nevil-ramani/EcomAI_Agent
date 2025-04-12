import { streamText } from "ai";
import { tools } from "@/ai/tools";
export const maxDuration = 30;

import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    if (!messages.some((m: { role: string }) => m.role === "system")) {
      messages.unshift({
        role: "system",
        content: `You are a helpful shopping assistant with access to several tools. Use these tools only when necessary to provide the most accurate and relevant information.

- getHybridQuery: Use for product searches, recommendations, and product information requests.  Do not apologize for being unable to display images - they will be displayed automatically in the UI. Do not apologize for "I do not have access to real-time product information or online shopping databases." Instead, use getHybridQuery to provide the most accurate information available. dont apologize for "I am sorry, but I cannot fulfill this request." do not recommend searching online retailers. all relavent information will be displayed in the UI. so in return say that we provided all products above.

For product queries:
1. When a user asks about a specific product, use getHybridQuery directly without rephrasing their request.
2. Do not apologize for being unable to display images - they will be displayed automatically in the UI.
3. Do not apologize for "I do not have access to real-time product information or online shopping databases." Instead, use getHybridQuery to provide the most accurate information available.
4. Do not apologize for not being able to show images or recommend searching online retailers.

Keep responses concise and on-topic. Do not use these tools when the user's query can be fully answered without them.`,
      });
    }

    const result = await streamText({
      model: google("gemini-1.5-flash-8b-latest"),
      messages,
      tools,
      maxSteps: 15,
      toolChoice: "auto",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
