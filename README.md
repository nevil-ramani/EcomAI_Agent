# AI-Powered Product Discovery Agent with Semantic Intelligence

https://github.com/user-attachments/assets/309ff832-2c7f-435e-898c-6ab31fbda526

This project delivers an intelligent e-commerce search agent that understands natural language queries and automatically determines the optimal search strategy for retrieving the most relevant products.

## Key Capabilities

- **Autonomous Search Strategy Selection**: Agent intelligently decides between SQL filtering or hybrid vector+SQL search based on query semantics
- **Natural Language Understanding**: Interprets complex shopping queries and extracts core semantic intent
- **Hybrid Retrieval System**: Combines traditional SQL filtering with semantic vector embeddings for superior search results
- **High-Performance Architecture**: Leverages Cloudflare AI Workers for edge computing and low-latency responses
- **Contextual Awareness**: Understands product domains, categories, and attributes to guide more precise search

## Technology Stack

- **Frontend**: Next.js 15, Tailwindcss
- **Backend**: Cloudflare AI Workers & Next js API
- **Database**: LibSQL
- **Vector Search**: BGE-large-en-v1.5 embeddings for semantic matching
- **AI Integration**: AI SDK for seamless model communication

## How the Agent Works

1. **Query Analysis & Intent Extraction**:
   - Parses natural language shopping queries
   - Identifies semantic components (style, use case, qualities)
   - Determines if the query requires semantic understanding or just filterable attributes

2. **Dynamic Search Strategy Execution**:
   - For filterable queries (price, ratings, category): Generates optimized SQL
   - For semantic queries: Creates embedding text and combines vector search with SQL filters
   - Handles hybrid queries with both semantic and filterable components

3. **Result Delivery**:
   - Returns precisely matched products based on the optimal search strategy
   - Prioritizes results based on semantic relevance and explicit filters

