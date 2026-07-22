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
      "👋 **Hello! I'm Reelix AI Assistant.**\n\n" +
      "What kind of movie are you looking for today?\n\n" +
      "• 🎬 Personalized recommendations\n" +
      "• 🍿 Trending & Top-rated films\n" +
      "• 🧠 Mind-bending Sci-Fi & Thrillers\n" +
      "• 📖 Movie plot summaries & analysis",
  },
];

const SUGGESTED_PROMPTS = [
  "🔥 Trending Now",
  "🏆 Highest Rated",
  "🚀 Mind Bending Sci-Fi",
  "😂 Comedy Hits",
  "👻 Chilling Horror",
  "❤️ Romantic Dramas",
];

const AIChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("reelix-ai-chat");
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
    localStorage.setItem("reelix-ai-chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      { sender: "user", type: "chat", text: prompt },
    ]);

    if (!customPrompt) setInput("");
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
          { sender: "ai", type: "chat", text: response.message },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          type: "chat",
          text: "❌ Sorry, I couldn't connect to the Reelix AI service. Please try again.",
        },
      ]);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-24 sm:right-6 z-[999] w-full sm:w-[420px] h-[90vh] sm:h-[620px] bg-zinc-950/95 border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl animate-in slide-in-from-bottom duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-purple-700 px-5 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <FaRobot className="text-lg" />
          </div>
          <div>
            <h2 className="text-white font-black text-lg tracking-wide leading-none">Reelix AI</h2>
            <p className="text-white/80 text-xs font-medium mt-0.5">Movie Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startNewChat}
            title="Reset Chat"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
          >
            <FaPlus size={12} />
          </button>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="border-b border-zinc-800/80 px-3 py-2.5 bg-zinc-900/50">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              disabled={loading}
              onClick={() => sendMessage(prompt)}
              className="bg-zinc-800/90 hover:bg-red-600 hover:text-white transition rounded-full px-3 py-1 text-xs text-gray-300 font-medium whitespace-nowrap border border-zinc-700/60"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-sm">
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl leading-relaxed shadow-lg ${
                  message.sender === "user"
                    ? "bg-red-600 text-white rounded-br-xs font-medium"
                    : "bg-zinc-900 border border-zinc-800 text-gray-200 rounded-bl-xs"
                }`}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-base font-bold mb-1">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
                    p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1">{children}</ul>,
                    li: ({ children }) => <li>{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>

            {message.type === "recommendation" && message.movies?.length > 0 && (
              <div className="mt-3 grid grid-cols-1 gap-2.5 pl-2">
                {message.movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-3 text-gray-400">
              <FaRobot className="text-red-500 text-base animate-pulse" />
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.3s]"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-zinc-800/80 bg-zinc-950 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            placeholder="Ask Reelix AI about movies..."
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-zinc-900 rounded-xl px-4 py-3 outline-none text-white text-sm placeholder-gray-500 border border-zinc-800 focus:border-red-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white flex items-center justify-center transition shadow-lg shadow-red-600/30"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
