import { tool } from "ai";
import { z } from "zod";

import { createClient as dbCreateClient } from "@libsql/client";

const dbClient = dbCreateClient({
  url:
    process.env.TURSO_DATABASE_URL ||
    (() => {
      throw new Error("TURSO_DATABASE_URL is not defined");
    })(),
  authToken:
    process.env.TURSO_AUTH_TOKEN ||
    (() => {
      throw new Error("TURSO_AUTH_TOKEN is not defined");
    })(),
});

async function fetchEmbeddings(text: string): Promise<number[]> {
  const response = await fetch(
    "https://vector-embedding.nevilramani20.workers.dev/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.EMBEDDING_SECRET_KEY,
      },
      body: JSON.stringify({ text: text }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Network response was not ok: ${response.status} ${response.statusText}`
    );
  }

  const embeddings = await response.json();
  // console.log("Received embeddings with shape:", embeddings.embedding.shape);
  return embeddings.embedding.data;
}

const getHybridQuery = tool({
  description: "Get a hybrid SQL query from a user's product request.",
  parameters: z.object({
    productRequest: z
      .string()
      .describe("The user's request for a product query."),
  }),
  execute: async ({ productRequest }) => {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/hybridquery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: productRequest,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status},  Text: ${errorText}`
        );
      }

      const data = await response.json();


      const embedding = await fetchEmbeddings(data.embedding_text);

      const embeddingString = embedding.join(",");
      if (data.query.includes("JOIN") && data.embedding_text != "") {
        // const join = data.query.split("JOIN")[1];
        const limit = data.limit;
        // const finalQuery = `SELECT * FROM vector_top_k('product_idx', '[${embeddingString}]', ${limit}) JOIN ${join}`;

        try {
          const result = await dbClient.execute(
            `SELECT id, brand, review_count, description, product_name, category_name, root_category_name, main_image, rating, initial_price, discounted_price, specifications, image_urls, rating_stars, sizes, colors, other_attributes, categories FROM vector_top_k('product_idx', '[${embeddingString}]', ${limit}) JOIN products ON products.rowid = id`
          );

          // const result = await dbClient.execute(
          //   `SELECT brand, description FROM products LIMIT 10`
          // );

          return result.rows;
        } catch (dbError: unknown) {
          console.error("Database query error:", dbError);
          if (dbError instanceof Error) {
            return `Database query error: ${dbError.message}`;
          } else {
            return `Database query error: ${String(dbError)}`;
          }
        }
      } else {
        console.log("The query does not contain a JOIN operation.");
        return "The query does not contain a JOIN operation.";
      }
    } catch (error: unknown) {
      console.error("Error fetching hybrid query:", error);
      if (error instanceof Error) {
        return `Database query error: ${error.message}`;
      } else {
        return `Database query error: ${String(error)}`;
      }
    }
  },
});

export const tools = {
  getHybridQuery,
};
