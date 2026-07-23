import { FaTv, FaDesktop, FaRobot, FaBookmark, FaServer, FaShieldAlt } from "react-icons/fa";

const Reasons = () => {
  const reasonsList = [
    {
      icon: FaTv,
      title: "Stream on Any Device",
      description: "Enjoy seamless playback on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, iPad, and mobile devices.",
      badge: "Cross-Platform",
    },
    {
      icon: FaServer,
      title: "6 High-Definition Servers",
      description: "Switch between 6 fast streaming mirrors with 1080p Ultra HD quality, zero buffering, and regional fallbacks.",
      badge: "99.9% Uptime",
    },
    {
      icon: FaRobot,
      title: "AI-Powered Recommendations",
      description: "Unsure what to watch? Ask Reelix AI for personalized movie and series recommendations based on mood or tropes.",
      badge: "Gemini AI",
    },
    {
      icon: FaBookmark,
      title: "Personal Watchlist Sync",
      description: "Save movies and TV shows to your custom watchlist with one click and track your watched progress.",
      badge: "Instant Sync",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-500/30 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-4 shadow-md">
          <FaShieldAlt className="text-red-500" />
          <span>Next-Gen Streaming Platform</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Why Stream on <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">Reelix</span>?
        </h2>
        <p className="text-gray-400 mt-3 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Built for movie lovers who demand top visual quality, smart AI picks, and ultra-fast playback.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasonsList.map((reason, index) => {
          const Icon = reason.icon;
          return (
            <div
              key={index}
              className="bg-zinc-900/60 border border-zinc-800/80 hover:border-red-600/60 p-8 rounded-3xl flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_30px_-5px_rgba(229,9,20,0.3)] group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600/20 to-purple-600/20 border border-red-500/30 flex items-center justify-center text-red-500 text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    <Icon />
                  </div>
                  <span className="text-[10px] font-black uppercase bg-zinc-950 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-md">
                    {reason.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {reason.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Reasons;