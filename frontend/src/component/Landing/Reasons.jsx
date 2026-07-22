const Reasons = () => {
  const reasonsList = [
    {
      icon: "📺",
      title: "Enjoy on your TV",
      description: "Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
    },
    {
      icon: "📥",
      title: "Watch Anywhere, Anytime",
      description: "Stream seamlessly on your phone, tablet, laptop, desktop, and smart television without interruption.",
    },
    {
      icon: "🤖",
      title: "AI-Powered Movie Assistant",
      description: "Unsure what to watch? Ask Reelix AI for personalized recommendations based on mood or genre.",
    },
    {
      icon: "✨",
      title: "Build Your Watchlist",
      description: "Save movies to your custom watchlist with one click and keep track of films you want to see.",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          More Reasons to Join <span className="text-gradient-red">Reelix</span>
        </h2>
        <p className="text-gray-400 mt-3 text-base sm:text-lg max-w-xl mx-auto">
          Everything you need for an unforgettable movie streaming experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasonsList.map((reason, index) => (
          <div
            key={index}
            className="glass-card glass-card-hover p-6 sm:p-8 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600/20 to-purple-600/20 border border-red-500/30 flex items-center justify-center text-3xl mb-6 shadow-inner">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reasons;