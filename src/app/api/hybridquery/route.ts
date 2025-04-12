import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    // Ensure system message is always first
    if (!messages.some((m: { role: string }) => m.role === "system")) {
      messages.unshift({
        role: "system",
        content: `You are an e-commerce data expert. Your job is to help the user write a SQL query to retrieve the data they need.

    The table schema is as follows:

    products (
      id SERIAL PRIMARY KEY,
      root_category_name VARCHAR(255) NOT NULL,
      initial_price DECIMAL(10, 2),
      discount DECIMAL(10, 2),
      rating DECIMAL(2, 1),
      review_count INT,
      rating_stars JSONB
    );

    root category name: Clothing Home Beauty Electronics Sports Toys Accessories Shoes Bags Jewelry Watches Automotive Books

    Only retrieval queries are allowed.
    When answering questions about a specific field, ensure you are selecting the identifying column.

    IMPORTANT: For hybrid search, you need to return three things:
    1. SQL query: Create a complete SQL query with these components:
       - Vector search: "SELECT * FROM vector_top_k('product_idx', 'embeddings')"
       - Table join: "JOIN products ON products.rowid = id"
       - Filtering conditions: for any specific attribute filters
       - default limit are 10

    2. embedding_text: A textual description designed for semantic search, capturing product features that are difficult to express using SQL queries. please dont Return empty .if there is no need for embedding_text, return category name or something similer that help to find good products.

    3. limit: limit the number of results returned.

    If there's no condition needed, return an appropriate default condition.
    default limit are 10
    Note: initial_price and discount are in dollars.`,
      });
    }

    const result = await generateObject({
      model: google("gemini-1.5-flash-8b-latest"),
      messages,

      schema: z.object({
        query: z.string(),
        embedding_text: z.string(),
        limit: z.number().optional(),
      }),
    });

    if (
      result.object &&
      typeof result.object === "object" &&
      "query" in result.object
    ) {
      return new Response(
        JSON.stringify({
          query: result.object.query,
          embedding_text: result.object.embedding_text || "",
          limit: result.object.limit || 10,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      throw new Error("Unexpected result format");
    }
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
