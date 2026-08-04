import React, { useEffect, useState } from "react";
import { FaPlay, FaTrash, FaClock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useGetWatchHistoryQuery, useDeleteWatchHistoryItemMutation } from "../../redux/api/users";
import { useSelector } from "react-redux";

const ContinueWatchingRow = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth || {});

  // RTK Query for authenticated user
  const { data: dbHistory, refetch } = useGetWatchHistoryQuery(undefined, {
    skip: !userInfo,
  });

  const [deleteItem] = useDeleteWatchHistoryItemMutation();
  const [localHistory, setLocalHistory] = useState([]);

  // Load localStorage fallback for guest users
  useEffect(() => {
    try {
      const stored = localStorage.getItem("reelix-watch-progress");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Format into array
        const list = Object.values(parsed).sort(
          (a, b) => new Date(b.lastWatchedAt || 0) - new Date(a.lastWatchedAt || 0)
        );
        setLocalHistory(list);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const historyItems = userInfo && dbHistory && dbHistory.length > 0 ? dbHistory : localHistory;

  if (!historyItems || historyItems.length === 0) return null;

  const handleResume = (item) => {
    if (item.mediaType === "tv") {
      navigate(`/tv/${item.mediaId}?season=${item.season || 1}&episode=${item.episode || 1}`);
    } else {
      navigate(`/movie/${item.mediaId}`);
    }
  };

  const handleRemove = async (e, item) => {
    e.stopPropagation();
    if (userInfo) {
      try {
        await deleteItem(item.mediaId).unwrap();
        refetch();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const stored = localStorage.getItem("reelix-watch-progress");
        if (stored) {
          const parsed = JSON.parse(stored);
          delete parsed[item.mediaId];
          localStorage.setItem("reelix-watch-progress", JSON.stringify(parsed));
          setLocalHistory(Object.values(parsed));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="my-8 px-4 md:px-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
          <FaClock className="text-lg" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Continue Watching</h3>
          <p className="text-xs text-slate-400">Pick up right where you left off</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-amber-500/30">
        {historyItems.map((item, idx) => {
          const progressPercent =
            item.totalDurationSeconds > 0
              ? Math.min(100, Math.round((item.progressSeconds / item.totalDurationSeconds) * 100))
              : 50;

          return (
            <div
              key={idx}
              onClick={() => handleResume(item)}
              className="group relative flex-shrink-0 w-64 bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl overflow-hidden cursor-pointer shadow-lg transition duration-300 transform hover:-translate-y-1"
            >
              {/* Image & Overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={
                    item.backdropPath
                      ? `https://image.tmdb.org/t/p/w500${item.backdropPath}`
                      : item.posterPath
                      ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
                      : "https://via.placeholder.com/300x169"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/50 transform group-hover:scale-110 transition">
                    <FaPlay className="ml-1 text-lg" />
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleRemove(e, item)}
                  title="Remove from history"
                  className="absolute top-2 right-2 p-1.5 bg-slate-950/80 hover:bg-red-900/80 text-slate-400 hover:text-red-300 rounded-md border border-slate-700/50 opacity-0 group-hover:opacity-100 transition"
                >
                  <FaTrash className="text-xs" />
                </button>

                {/* TV Episode Indicator Badge */}
                {item.mediaType === "tv" && (
                  <span className="absolute bottom-2 left-2 bg-amber-500/90 text-slate-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow">
                    S{item.season || 1} E{item.episode || 1}
                  </span>
                )}
              </div>

              {/* Title & Progress Bar */}
              <div className="p-3">
                <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-amber-400 transition">
                  {item.title || "Continue Watching"}
                </h4>

                {/* Progress bar container */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueWatchingRow;
