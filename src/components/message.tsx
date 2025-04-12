import type { Message } from "ai";
import ReactMarkdown from "react-markdown";
import DynamicProductListingPage from "@/components/products/ProductList";

export default function Message({ message }: { message: Message }) {
  const isUserMessage = message.role === "user";

  return (
    <>
      {message.toolInvocations?.map((tool) => {
        const { toolName, toolCallId, state } = tool;

        if (state === "result") {
          if (toolName === "getHybridQuery") {
            return (
              <div key={toolCallId} className="block">
                <DynamicProductListingPage productsData={tool.result} />
              </div>
            );
          }
        } else if (state === "partial-call") {
          if (toolName === "getHybridQuery") {
            return (
              <div key={toolCallId} className="block">
                Loading hybrid query...
              </div>
            );
          }
        }
      })}

      {message.content ? (
        <div
          className={`flex ${
            isUserMessage ? "justify-end" : "justify-start"
          } mb-2`}
        >
          <div
            className={`p-3 rounded-xl ${
              isUserMessage
                ? "flex max-w-[50vw] w-fit self-end rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 relative bg-neutral-900 rounded-xl border border-neutral-800 mt-5 self-end"
                : "text-zinc-100"
            }`}
          >
            <div className="prose text-zinc-100">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 text-zinc-400 flex items-center space-x-2">
          <div className="animate-pulse">
            Hold on, AI is processing your request...
          </div>
        </div>
      )}
    </>
  );
}
