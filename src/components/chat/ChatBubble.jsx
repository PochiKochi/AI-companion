import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function ChatBubble({ message, isUser }) {
  if (!message) return null;

  const content = message.content || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-gray-500" />
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-500 text-white rounded-2xl rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p>{content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="my-1">{children}</p>,
              strong: ({ children }) => <strong>{children}</strong>,
              em: ({ children }) => <em>{children}</em>,
              ul: ({ children }) => <ul className="ml-4 list-disc">{children}</ul>,
              li: ({ children }) => <li>{children}</li>
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}