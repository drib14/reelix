import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaCompass, FaHeart } from "react-icons/fa";
import { FaWandMagicSparkles, FaDice } from "react-icons/fa6";

const MobileBottomNav = ({ setVibeOpen, setRouletteOpen }) => {
  const location = useLocation();
  const watchlist = useSelector((state) => state.watchlist.movies);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800/80 px-2 py-2 flex items-center justify-around backdrop-blur-2xl shadow-[0_-10px_25px_rgba(0,0,0,0.8)] pb-safe">
      {/* Home */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          isActive("/") ? "text-red-500 font-bold scale-105" : "text-gray-400 hover:text-white"
        }`}
      >
        <FaHome className="text-lg mb-0.5" />
        <span className="text-[10px] font-medium tracking-tight">Home</span>
      </Link>

      {/* Explore */}
      <Link
        to="/movies"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          isActive("/movies") ? "text-red-500 font-bold scale-105" : "text-gray-400 hover:text-white"
        }`}
      >
        <FaCompass className="text-lg mb-0.5" />
        <span className="text-[10px] font-medium tracking-tight">Explore</span>
      </Link>

      {/* AI Vibe Curator */}
      <button
        onClick={() => setVibeOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-amber-400 hover:text-amber-300 transition-all transform hover:scale-105"
      >
        <div className="p-1 rounded-lg bg-amber-500/20 border border-amber-500/30 mb-0.5">
          <FaWandMagicSparkles className="text-sm" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">AI Vibe</span>
      </button>

      {/* Roulette */}
      <button
        onClick={() => setRouletteOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-red-400 hover:text-red-300 transition-all transform hover:scale-105"
      >
        <div className="p-1 rounded-lg bg-red-600/20 border border-red-500/30 mb-0.5">
          <FaDice className="text-sm" />
        </div>
        <span className="text-[10px] font-bold tracking-tight">Roulette</span>
      </button>

      {/* Watchlist */}
      <Link
        to="/watchlist"
        className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          isActive("/watchlist") ? "text-red-500 font-bold scale-105" : "text-gray-400 hover:text-white"
        }`}
      >
        <div className="relative">
          <FaHeart className="text-lg mb-0.5" />
          {watchlist.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] w-3.5 h-3.5 rounded-full font-bold flex items-center justify-center">
              {watchlist.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-tight">Saved</span>
      </Link>
    </div>
  );
};

export default MobileBottomNav;
