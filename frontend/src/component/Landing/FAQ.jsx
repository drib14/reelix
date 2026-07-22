import { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Reelix?",
      answer:
        "Reelix is a modern movie discovery and streaming platform built with React, Redux, Node.js, Express, and MongoDB. It features a curated movie catalog, real-time search, personal watchlists, and an intelligent AI assistant.",
    },
    {
      question: "How does the AI Assistant work?",
      answer:
        "Click the floating AI assistant button on the bottom right corner of any page. You can ask for recommendations by genre, mood, actors, or release year, and Reelix AI will suggest top-rated movies directly from our library.",
    },
    {
      question: "Is Reelix free to use?",
      answer:
        "Yes! You can explore movies, search titles, read reviews, and use our AI assistant for free. Creating an account unlocks personal watchlists and review capabilities.",
    },
    {
      question: "Where can I watch Reelix?",
      answer:
        "Reelix works anywhere on any web browser — smartphones, tablets, laptops, and desktop computers.",
    },
    {
      question: "How do I add movies to my Watchlist?",
      answer:
        "Simply browse to any movie card or detail page and click the 'Add to Watchlist' button. Your saved movies will instantly sync to your Watchlist page.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Frequently Asked <span className="text-gradient-red">Questions</span>
        </h2>
        <p className="text-gray-400 mt-3 text-base sm:text-lg">
          Have questions? We've got answers.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="glass-card rounded-2xl overflow-hidden transition-all duration-300 border border-zinc-800/80 hover:border-zinc-700"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white hover:text-red-400 transition"
              >
                <span>{faq.question}</span>
                <span
                  className={`text-2xl text-red-500 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
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