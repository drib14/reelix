import { FaTv } from "react-icons/fa";

const PLATFORMS = [
  { name: "Netflix", color: "from-red-600 to-red-800", text: "text-red-500", mark: "N" },
  { name: "Disney+", color: "from-blue-600 to-indigo-800", text: "text-blue-400", mark: "D+" },
  { name: "Prime Video", color: "from-sky-500 to-blue-700", text: "text-sky-400", mark: "PV" },
  { name: "Apple TV+", color: "from-gray-700 to-gray-900", text: "text-gray-300", mark: "TV+" },
  { name: "Max", color: "from-purple-600 to-blue-900", text: "text-purple-400", mark: "MAX" },
  { name: "Hulu", color: "from-emerald-500 to-teal-800", text: "text-emerald-400", mark: "HULU" },
  { name: "Paramount+", color: "from-blue-500 to-blue-800", text: "text-blue-400", mark: "P+" },
  { name: "Peacock", color: "from-amber-500 to-purple-600", text: "text-amber-400", mark: "PEA" },
];

const PlatformsMarquee = () => {
  return (
    <section className="bg-zinc-950/80 border-y border-zinc-800/80 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Heading */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
            <FaTv className="text-lg" />
          </div>
          <div>
            <h3 className="text-white font-extrabold text-base sm:text-lg tracking-tight">
              All Major Platforms in One Hub
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Discover titles aggregated from top global streaming services.
            </p>
          </div>
        </div>

        {/* Platform Logomarks Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-md group cursor-default"
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-[9px] font-black text-white shadow-inner`}>
                {platform.mark}
              </div>
              <span className="text-gray-300 group-hover:text-white font-bold text-xs sm:text-sm">
                {platform.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformsMarquee;
