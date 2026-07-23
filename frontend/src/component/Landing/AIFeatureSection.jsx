import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRobot, FaMagic, FaSearch, FaArrowRight, FaPaperPlane } from "react-icons/fa";

const SAMPLE_PROMPTS = [
  "Mind-bending sci-fi movies like Inception",
  "Top-rated thriller series with plot twists",
  "Feel-good anime for a rainy weekend",
  "High-octane action blockbusters from 2024",
];

const AIFeatureSection = () => {
  const [activePrompt, setActivePrompt] = useState(SAMPLE_PROMPTS[0]);

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-red-950/30 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Glowing Background Glow Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Feature Description */}
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-purple-950/60 border border-purple-500/40 text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-6 shadow-md">
              <FaRobot className="text-purple-400 animate-pulse" />
              <span>Powered by Advanced Gemini AI</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Can't Decide What to Watch? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-400 to-pink-500">
                Ask Reelix AI Assistant
              </span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
              Describe your mood, favorite tropes, actors, or genres in plain English. Our intelligent recommendation engine curates tailored lists in seconds.
            </p>

            <Link
              to="/movies"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition duration-300"
            >
              <span>Try AI Discovery</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {/* Right Interactive AI Mockup Card */}
          <div className="w-full max-w-md bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg">
                <FaRobot />
              </div>
              <div>
                <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                  <span>Reelix AI Assistant</span>
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black">
                    LIVE
                  </span>
                </h4>
                <p className="text-gray-400 text-xs">Ready for your prompt</p>
              </div>
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Sample Prompts:
              </p>
              {SAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setActivePrompt(prompt)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-between ${
                    activePrompt === prompt
                      ? "bg-red-950/50 border-red-500/60 text-white shadow-md"
                      : "bg-zinc-900/80 border-zinc-800 text-gray-300 hover:bg-zinc-800"
                  }`}
                >
                  <span className="truncate pr-2">"{prompt}"</span>
                  <FaMagic className="text-red-400 text-xs flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Mock Chat Input Form */}
            <Link
              to={`/search/${encodeURIComponent(activePrompt)}`}
              className="mt-6 flex items-center bg-zinc-900 border border-red-600/50 rounded-2xl p-2 pl-4 text-white text-xs font-bold hover:bg-zinc-850 transition group"
            >
              <span className="flex-1 truncate text-gray-200">
                Search "{activePrompt}"...
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                <FaPaperPlane className="text-xs" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeatureSection;
