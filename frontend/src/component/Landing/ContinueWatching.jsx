import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaHistory, FaTimes } from "react-icons/fa";
import { REELIX_FALLBACK_POSTER } from "../../utils/assets";

const ContinueWatching = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loaded = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("reelix_progress_")) {
          const val = localStorage.getItem(key);
          if (val) {
            const parsed = JSON.parse(val);
            // key format: reelix_progress_{id}_s{season}_e{episode}
            const parts = key.replace("reelix_progress_", "").split("_");
            const movieId = parts[0];
            const seasonStr = parts[1]?.replace("s", "");
            const epStr = parts[2]?.replace("e", "");

            if (movieId && parsed.percent > 0 && parsed.percent < 98) {
              loaded.push({
                key,
                movieId,
                season: seasonStr ? parseInt(seasonStr) : 1,
                episode: epStr ? parseInt(epStr) : 1,
                percent: Math.min(100, Math.round(parsed.percent)),
                updatedAt: parsed.updatedAt || Date.now(),
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn("Failed loading continue watching", e);
    }

    // Sort by most recently updated
    loaded.sort((a, b) => b.updatedAt - a.updatedAt);
    setItems(loaded.slice(0, 8));
  }, []);

  const removeProgress = (e, keyToRemove) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem(keyToRemove);
    setItems((prev) => prev.filter((item) => item.key !== keyToRemove));
  };

  if (items.length === 0) return null;

  return (
    <section className="mb-14 relative group/section">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <FaHistory className="text-red-600 text-xl" />
          <span>Continue Watching</span>
        </h2>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth px-1">
        {items.map((item) => {
          const isTv = item.season > 1 || item.episode > 1;
          const link = `/movies/${item.movieId}${isTv ? "?type=tv" : ""}`;

          return (
            <div
              key={item.key}
              className="relative flex-shrink-0 group/card cursor-pointer w-[200px] sm:w-[240px]"
            >
              <Link to={link} className="block">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-300 group-hover/card:scale-105 group-hover/card:border-red-600/60 shadow-xl">
                  {/* Fallback / Background Card */}
                  <img
                    src={REELIX_FALLBACK_POSTER}
                    alt="Continue Watching"
                    className="w-full h-full object-cover opacity-60"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center pl-0.5 shadow-2xl transform group-hover/card:scale-110 transition duration-300">
                      <FaPlay className="text-sm" />
                    </div>
                  </div>

                  {/* Title & Ep Tag */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[11px] font-black text-red-400 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1 inline-block">
                      S{item.season}:EP {item.episode} • {item.percent}%
                    </span>
                    <h4 className="text-white font-bold text-xs sm:text-sm line-clamp-1">
                      Resume Episode {item.episode}
                    </h4>
                  </div>

                  {/* Dismiss X button */}
                  <button
                    onClick={(e) => removeProgress(e, item.key)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-gray-400 hover:text-white flex items-center justify-center text-[10px] transition backdrop-blur-sm z-20"
                    title="Remove from history"
                  >
                    <FaTimes />
                  </button>

                  {/* Red Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
                    <div
                      style={{ width: `${item.percent}%` }}
                      className="h-full bg-red-600 shadow-[0_0_8px_rgba(229,9,20,0.8)]"
                    ></div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ContinueWatching;
