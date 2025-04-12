"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import Message from "@/components/message";
import Button from "@/components/Button";
import { Send } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Which clothing items have the best price-to-rating ratio?",
  "Which home products have the highest percentage discount?",
  "Find all beauty products with a discount greater than 30% of their initial price",
  "Find the best-rated home decor items under $50",
  "comfortable footwear with good customer satisfaction",
  "Find high-end jewelry items with rating above 4",
];

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
  } = useChat({
    onFinish: () => {
      setSuggestedQuestionsVisible(true);
    },
  });
  const [showRetry, setShowRetry] = useState(false);
  const [suggestedQuestionsVisible, setSuggestedQuestionsVisible] =
    useState(true);

  const handleSuggestedQuestionClick = (question: string) => {
    const syntheticEvent = {
      target: Object.assign(document.createElement("input"), {
        value: question,
      }),
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(syntheticEvent);
    setSuggestedQuestionsVisible(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setSuggestedQuestionsVisible(false);
    handleSubmit(e);
  };

  const isInputFilled = input.trim().length > 0;

  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-[#0A0A0A] px-4 md:px-8 lg:px-12 overflow-y-auto scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded">
      <div className="container mx-auto max-w-6xl flex flex-col h-full">
        <div className="flex-1">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="p-4 text-zinc-400 flex items-center space-x-2">
              {/* <div className="animate-pulse">AI is thinking...</div> */}
              {showRetry && (
                <button
                  onClick={() => {
                    reload();
                    setShowRetry(false);
                  }}
                  className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M21 2v6h-6"></path>
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                    <path d="M3 22v-6h6"></path>
                    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                  </svg>
                  Retry
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 text-red-400 flex items-center space-x-2">
              <div>Network error. Please try again.</div>
              <button
                onClick={() => {
                  reload();
                  setShowRetry(false);
                }}
                className="px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M21 2v6h-6"></path>
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                  <path d="M3 22v-6h6"></path>
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                </svg>
                Retry
              </button>
            </div>
          )}
        </div>

        <div className="w-full p-4 mt-auto sticky bottom-0 bg-[#0A0A0A]">
          {suggestedQuestionsVisible && !isLoading && (
            <div className="mb-4 p-4 bg-zinc-900 rounded-lg">
              <h2 className="text-zinc-300 text-lg font-semibold mb-3">
                Try These Questions
              </h2>
              <div className="flex overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 scrollbar-thumb-rounded">
                <div className="flex flex-nowrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestionClick(question)}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 transition-colors text-sm whitespace-nowrap flex-shrink-0"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => {
                handleInputChange(e);
                if (!isLoading) {
                  setSuggestedQuestionsVisible(e.target.value.length === 0);
                }
              }}
              placeholder="Type your message..."
              className="flex-1 pl-3 border-2 border-zinc-700 rounded-lg bg-transparent text-zinc-200 outline-none 
                focus:border-zinc-600 transition-all duration-300 
                placeholder-zinc-500"
            />
            {!isInputFilled ? (
              <Button.Root size="xl" variant="soft" intent="neutral" disabled>
                <Send />
              </Button.Root>
            ) : (
              <Button.Root size="xl" variant="soft" intent="primary">
                <Send />
              </Button.Root>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
