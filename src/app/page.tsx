"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import Message from "@/components/message";
import Button from "@/components/Button";
import { Send } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Space saving storage solutions for small apartments",
  "Pet friendly furniture that resists scratches and stains",
  "Breathable athletic wear for high intensity training sessions",
  "Which home products have the highest percentage discount?",
  "Find all beauty products with a discount greater than 10% of their initial price",
  "Find the best rated home decor items under $50",
  "Find high end jewelry items with rating above 4",
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
    <div className="flex flex-col h-screen w-full mx-auto bg-[#0A0A0A] px-2 sm:px-4 md:px-8 lg:px-12 overflow-y-auto scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded">
      <div className="container mx-auto max-w-6xl flex flex-col">
        <div className="flex-1 pb-56 sm:pb-56">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="p-2 sm:p-4 text-zinc-400 flex items-center space-x-2">
              {showRetry && (
                <button
                  onClick={() => {
                    reload();
                    setShowRetry(false);
                  }}
                  className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
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
            <div className="p-2 sm:p-4 text-red-400 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="text-sm sm:text-base">
                Oops! Something went wrong. Give it another try.
              </div>
              <button
                onClick={() => {
                  reload();
                  setShowRetry(false);
                }}
                className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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

        <div className="w-full p-2 sm:p-4 fixed bottom-0 left-0 right-0 bg-[#0A0A0A]">
          <div className="container mx-auto max-w-6xl">
            {suggestedQuestionsVisible && !isLoading && (
              <div className="mb-3 p-2 sm:p-4 bg-zinc-900 rounded-lg">
                <h2 className="text-zinc-300 text-base sm:text-lg font-semibold mb-2">
                  Try These Questions
                </h2>
                <div className="flex overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 scrollbar-thumb-rounded">
                  <div className="flex flex-nowrap gap-2">
                    {SUGGESTED_QUESTIONS.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestionClick(question)}
                        className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full hover:bg-zinc-700 transition-colors text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
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
                className="flex-1 pl-3 py-2 text-sm sm:text-base border-2 border-zinc-700 rounded-lg bg-transparent text-zinc-200 outline-none 
                  focus:border-zinc-600 transition-all duration-300 
                  placeholder-zinc-500"
              />
              {!isInputFilled ? (
                <Button.Root
                  size="lg"
                  variant="soft"
                  intent="neutral"
                  disabled
                  className="hidden sm:flex sm:items-center"
                >
                  <Send size={18} />
                </Button.Root>
              ) : (
                <Button.Root
                  size="lg"
                  variant="soft"
                  intent="primary"
                  className="hidden sm:flex sm:items-center"
                >
                  <Send size={18} />
                </Button.Root>
              )}
              {/* Mobile-specific button */}
              {!isInputFilled ? (
                <Button.Root
                  size="lg"
                  variant="soft"
                  intent="neutral"
                  disabled
                  className="flex sm:hidden items-center justify-center w-14 h-14"
                >
                  <Send size={24} />
                </Button.Root>
              ) : (
                <Button.Root
                  size="lg"
                  variant="soft"
                  intent="primary"
                  className="flex sm:hidden items-center justify-center w-14 h-14"
                >
                  <Send size={24} />
                </Button.Root>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
