import React from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaStar, FaPlay, FaRedo, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import { REELIX_FALLBACK_POSTER } from "../utils/assets";
import Tilt3DCard from "./Tilt3DCard";

const MovieRouletteResultModal = ({ isOpen, movie, onClose, onSpinAgain }) => {
  if (!isOpen || !movie) return null;

  const posterSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.poster || movie.image || movie.backdrop || REELIX_FALLBACK_POSTER;

  const rating = movie.vote_average || movie.rating;
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : movie.year || "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl overscroll-contain animate-hero-entry">
      <div className="relative w-full max-w-md bg-zinc-900 border border-red-600/40 rounded-3xl p-6 shadow-2xl overflow-hidden my-auto overscroll-contain">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-red-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-amber-500/15 rounded-full blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition z-20 border border-zinc-700/60"
        >
          <FaTimes className="text-sm" />
        </button>

        {/* Badge Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 text-xs font-bold uppercase px-3 py-1 rounded-full border border-red-600/40 mb-2">
            <FaTrophy className="text-amber-400 text-xs" />
            <span>Roulette Winner</span>
          </div>
          <h2 className="text-xl font-black text-white line-clamp-1">
            {movie.title || movie.name}
          </h2>
        </div>

        {/* 3D Poster Card */}
        <Tilt3DCard maxTilt={10} scale={1.03} className="w-full mb-4">
          <div className="relative aspect-[2/3] w-44 mx-auto rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-700 shadow-2xl">
            <img
              src={posterSrc}
              alt={movie.title || movie.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = REELIX_FALLBACK_POSTER;
              }}
            />
            {rating && (
              <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-md border border-amber-400/30 flex items-center gap-1">
                <FaStar className="text-[10px]" />
                <span>{Number(rating).toFixed(1)}</span>
              </div>
            )}
          </div>
        </Tilt3DCard>

        {/* Meta Info & Overview */}
        <div className="text-center space-y-2 mb-6">
          {releaseYear && (
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-400">
              <FaCalendarAlt className="text-[10px]" />
              <span>Released {releaseYear}</span>
            </div>
          )}
          <p className="text-xs text-gray-300 line-clamp-3 px-2 leading-relaxed">
            {movie.overview || "An exceptional movie pick ready for your watch session."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to={`/movies/${movie.id || movie._id}`}
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition transform hover:scale-105"
          >
            <FaPlay className="text-[10px]" />
            <span>Watch Movie</span>
          </Link>

          <button
            onClick={() => {
              onClose();
              onSpinAgain();
            }}
            className="bg-zinc-800 hover:bg-zinc-700 text-gray-200 text-xs px-4 py-3 rounded-xl font-bold flex items-center gap-1.5 transition border border-zinc-700"
          >
            <FaRedo className="text-[10px]" />
            <span>Respin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieRouletteResultModal;
