import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaRobot, FaTimes, FaPlus } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

import { askMovieAI, clearAISession } from "../../redux/api/aiApi";

import MovieCard from "./MovieCard";

const DEFAULT_MESSAGES = [
  {
    sender: "ai",
    type: "chat",
    text:
      "👋 **Hello! I'm MovieFlix AI.**\n\n" +
      "Ask me anything about movies.\n\n" +
      "🎬 Recommendations\n" +
      "🍿 What to watch\n" +
      "⭐ Similar movies\n" +
      "🎭 Genres\n" +
      "📖 Movie explanations",
  },
];

const SUGGESTED_PROMPTS = [
  "🎬 Action",
  "😂 Comedy",
  "❤️ Romance",
  "👻 Horror",
  "🚀 Sci-Fi",
  "🧠 Mind Bending",
  "🔥 Trending",
  "🏆 Top Rated",
];

const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("movieflix-ai-chat");

    if (!saved) return DEFAULT_MESSAGES;

    try {
      const parsed = JSON.parse(saved);

      return parsed.length ? parsed : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("movieflix-ai-chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const startNewChat = () => {
    clearAISession();

    setMessages(DEFAULT_MESSAGES);

    setInput("");
  };

  const sendMessage = async (customPrompt = null) => {
    const prompt = customPrompt || input;

    if (!prompt.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        type: "chat",
        text: prompt,
      },
    ]);

    if (!customPrompt) {
      setInput("");
    }

    setLoading(true);

    try {
      const response = await askMovieAI(prompt);

      if (response.type === "recommendation") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            type: "recommendation",
            text: response.message,
            movies: response.movies,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            type: "chat",
            text: response.message,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          type: "chat",
          text: "❌ Sorry, I couldn't reach the AI server. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[999] w-[380px] h-[600px] bg-[#141414] rounded-3xl border border-zinc-700 shadow-2xl overflow-hidden flex flex-col">
      {/* ================= HEADER ================= */}

      <div className="bg-red-600 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaRobot className="text-white text-lg" />

            <h2 className="text-white font-bold text-2xl">MovieFlix AI</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startNewChat}
              title="New Chat"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <FaPlus size={12} className="text-white" />
            </button>

            <button
              onClick={onClose}
              className="text-white text-lg hover:rotate-90 transition"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </div>

      {/* ================= SUGGESTED PROMPTS ================= */}

      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              disabled={loading}
              onClick={() => sendMessage(prompt)}
              className="bg-zinc-800 hover:bg-red-600 transition rounded-full px-3 py-1.5 text-[12px] text-gray-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* ================= CHAT ================= */}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-3 py-2.5 rounded-2xl whitespace-pre-wrap leading-6 shadow ${
                  message.sender === "user"
                    ? "bg-red-600 text-white rounded-br-md"
                    : "bg-zinc-800 text-gray-200 rounded-bl-md"
                }`}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-2">{children}</h1>
                    ),

                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mb-2">{children}</h2>
                    ),

                    h3: ({ children }) => (
                      <h3 className="font-bold mb-2">{children}</h3>
                    ),

                    p: ({ children }) => <p className="mb-2">{children}</p>,

                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1">{children}</ul>
                    ),

                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-1">
                        {children}
                      </ol>
                    ),

                    li: ({ children }) => <li>{children}</li>,

                    strong: ({ children }) => (
                      <strong className="font-bold text-white">
                        {children}
                      </strong>
                    ),

                    code: ({ children }) => (
                      <code className="bg-black rounded px-1 py-0.5 text-red-400">
                        {children}
                      </code>
                    ),

                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>

            {message.type === "recommendation" &&
              message.movies &&
              message.movies.length > 0 && (
                <div className="mt-3 space-y-3">
                  {message.movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-3">
              <FaRobot className="text-red-500 text-lg" />

              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></span>

                <span
                  className="w-2 h-2 rounded-full bg-red-500 animate-bounce"
                  style={{
                    animationDelay: "0.15s",
                  }}
                ></span>

                <span
                  className="w-2 h-2 rounded-full bg-red-500 animate-bounce"
                  style={{
                    animationDelay: "0.3s",
                  }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ================= INPUT ================= */}

      <div className="border-t border-zinc-800 bg-[#181818] p-3">
        <div className="flex items-center gap-2">
          {" "}
          <input
            type="text"
            value={input}
            placeholder="Ask MovieFlix AI..."
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 bg-zinc-800 rounded-xl px-4 py-2.5 outline-none text-white placeholder-gray-500 border border-transparent focus:border-red-500 transition"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-900 flex items-center justify-center transition-all duration-200"
          >
            <FaPaperPlane className="text-white text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
