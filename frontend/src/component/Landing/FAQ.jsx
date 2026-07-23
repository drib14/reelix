import { useState } from "react";
import { FaQuestionCircle, FaChevronDown } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Reelix?",
      answer:
        "Reelix is a modern movie discovery & streaming platform built with React, Redux, Node.js, Express, and TMDB API. It features multi-server streaming, dynamic genre & region discovery, season/episode navigation for series and anime, personal watchlists, and an AI recommendation assistant.",
    },
    {
      question: "How do the streaming servers work?",
      answer:
        "Reelix provides 6 distinct high-definition streaming servers for both movies and TV series (VidSrc PRO, AutoEmbed Ultra, VidSrc.me, VidSrc.icu, 2Embed, and Direct HD Stream). If one server is slow in your region, you can easily switch servers from the top bar of the player.",
    },
    {
      question: "How do I stream TV Shows & Anime episodes?",
      answer:
        "When browsing any TV show or anime series, scroll to the Episodes section on the details page. You can select your desired season, filter episode ranges (e.g. 1-25, 26-50), search episode numbers, or use the 'Next Ep' button inside the player to auto-play episodes.",
    },
    {
      question: "How does the AI Assistant work?",
      answer:
        "You can click the AI Assistant button or type natural prompts in search (e.g. 'Mind-bending sci-fi movies like Interstellar'). Reelix AI will analyze your query and suggest tailored titles.",
    },
    {
      question: "Is Reelix free to use?",
      answer:
        "Yes! You can explore titles, search, filter streaming platforms, read reviews, and use our AI assistant for free.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-4 shadow-md">
          <FaQuestionCircle className="text-red-500" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">Questions</span>
        </h2>
        <p className="text-gray-400 mt-3 text-base sm:text-lg">
          Everything you need to know about streaming on Reelix.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden transition-all duration-300 border ${
                isOpen
                  ? "bg-zinc-900/90 border-red-600/60 shadow-xl"
                  : "bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white hover:text-red-400 transition"
              >
                <span>{faq.question}</span>
                <FaChevronDown
                  className={`text-sm text-red-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-red-400" : "rotate-0"
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-gray-300 text-sm sm:text-base leading-relaxed border-t border-zinc-800/60 animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;