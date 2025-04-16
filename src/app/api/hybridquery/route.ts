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
    const embeddingMessages = [...messages];
    
    if (!embeddingMessages.some((m: { role: string }) => m.role === "system")) {
      embeddingMessages.unshift({
        role: "system",
        content: `
E-Commerce Semantic Intent Extraction
Your task is to extract the pure semantic intent from e-commerce search queries. Generate a concise embedding_text that captures only the core product attributes and user intent that cannot be directly filtered using SQL operations.
Guidelines:

Focus exclusively on extracting product attributes related to:

Style (elegant, minimalist, vintage, modern)
Use cases (outdoor activities, formal events, everyday use)
Abstract qualities (comfortable, durable, sustainable, premium)
Conceptual features (waterproof, breathable, adjustable)
Occasions (wedding, hiking, office, casual)


Always return empty embedding text ("") when the query contains:

Only SQL-filterable conditions (price, discount, rating, category)
Only numerical comparisons or thresholds
Only sorting or limiting instructions
No semantic qualities that require embedding search


Reference the product domain context from our catalog:

Root categories: Clothing, Home, Beauty, Electronics, Sports, Toys, Accessories, Shoes, Bags, Jewelry, Watches, Automotive, Books


Output format: A concise string of relevant semantic terms without syntax or formatting, or an empty string when no embedding is needed

Examples:
Query: "Affordable waterproof hiking boots with good reviews"
Embedding_text: "waterproof hiking boots"
Query: "Top rated 4K TVs under $1000 with HDMI 2.1"
Embedding_text: "4K television"
Query: "Find all beauty products with a discount greater than 30% of their initial price"
Embedding_text: ""
Query: "Show me products from the Electronics category sorted by rating"
Embedding_text: ""`,
      });
    }

    const embeddingResult = await generateObject({
      model: google("gemini-1.5-flash-8b-latest"),
      messages: embeddingMessages,
      schema: z.object({
        embedding_text: z.string(),
      }),
    });

    const embedding_text = embeddingResult.object?.embedding_text || "";

    console.log("Embedding Result:", embedding_text);
    
    if (embedding_text === "") {

    const sqlMessages = [...messages];
    
    if (!sqlMessages.some((m: { role: string }) => m.role === "system")) {
      sqlMessages.unshift({
        role: "system",
        content: `You are an e-commerce data expert. Your job is to help the user write a SQL query to retrieve the data they need.

The table schema is as follows:

products (
  id SERIAL PRIMARY KEY,
  root_category_name VARCHAR(255) NOT NULL,
  initial_price DECIMAL(10, 2),
  discounted_price DECIMAL(10, 2),
  rating DECIMAL(2, 1),
  review_count INT,
  rating_stars JSONB
);

root category name: Clothing Home Beauty Electronics Sports Toys Accessories Shoes Bags Jewelry Watches Automotive Books

Only retrieval queries are allowed.
When answering questions about a specific field, ensure you are selecting the identifying column.

IMPORTANT: For hybrid search, you need to return three things:
1. SQL query: Create a complete SQL query with these components:
   - Selecet all from table: "SELECT * FROM products
   - Filtering conditions: for any specific attribute filters
   - default limit are 10

2. limit: limit the number of results returned.

If there's no condition needed, return an appropriate default condition.
default limit are 10
Note: initial_price and discount are in dollars.`,
      });
    }

    const sqlResult = await generateObject({
      model: google("gemini-1.5-flash-8b-latest"),
      messages: sqlMessages,
      schema: z.object({
        query: z.string(),
        limit: z.number().optional(),
      }),
    });

    console.log("SQL Result:", sqlResult.object?.query);
    console.log("SQL Limit:", sqlResult.object?.limit);

    return new Response(
      JSON.stringify({
        query: sqlResult.object?.query || "",
        limit: sqlResult.object?.limit || 10,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );



    } else {

    const sqlMessages = [...messages];
    
    if (!sqlMessages.some((m: { role: string }) => m.role === "system")) {
      sqlMessages.unshift({
        role: "system",
        content: `You are an e-commerce data expert. Your job is to help the user write a SQL query to retrieve the data they need.

The table schema is as follows:

products (
  id SERIAL PRIMARY KEY,
  root_category_name VARCHAR(255) NOT NULL,
  initial_price DECIMAL(10, 2),
  discounted_price DECIMAL(10, 2),
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
   - do not include the embedding text in the SQL query
   - do not use LIKE in the SQL query

2. limit: limit the number of results returned.

If there's no condition needed, return an appropriate default condition.
default limit are 10
Note: initial_price and discount are in dollars.`,
      });
    }

    const sqlResult = await generateObject({
      model: google("gemini-1.5-flash-8b-latest"),
      messages: sqlMessages,
      schema: z.object({
        query: z.string(),
        limit: z.number().optional(),
      }),
    });


    console.log("vector Result:", sqlResult.object?.query);
    console.log("vector Limit:", sqlResult.object?.limit);


    return new Response(
      JSON.stringify({
        query: sqlResult.object?.query || "",
        embedding_text: embedding_text,
        limit: sqlResult.object?.limit || 10,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    }

  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}