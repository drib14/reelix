import React, { useState } from "react";
import {
  FaDice,
  FaTimes,
  FaStar,
  FaFilter,
  FaFilm,
  FaBolt,
  FaFire,
  FaGhost,
  FaRocket,
  FaSkull,
  FaLaugh,
  FaMask,
  FaDragon,
  FaTheaterMasks,
  FaRunning,
} from "react-icons/fa";
import { useGetPopularMoviesQuery, useGetTopRatedMoviesQuery } from "../redux/api/movies";
import MovieRouletteResultModal from "./MovieRouletteResultModal";

const ROULETTE_GENRES = [
  { id: "all", label: "Any Genre", icon: FaFilm },
  { id: "28", label: "Action", icon: FaBolt },
  { id: "12", label: "Adventure", icon: FaRunning },
  { id: "16", label: "Animation", icon: FaDragon },
  { id: "35", label: "Comedy", icon: FaLaugh },
  { id: "80", label: "Crime", icon: FaMask },
  { id: "18", label: "Drama", icon: FaTheaterMasks },
  { id: "14", label: "Fantasy", icon: FaDragon },
  { id: "27", label: "Horror", icon: FaGhost },
  { id: "878", label: "Sci-Fi", icon: FaRocket },
  { id: "53", label: "Thriller", icon: FaSkull },
  { id: "all-top", label: "Top Rated", icon: FaStar },
];

const FALLBACK_MOVIES = [
  {
    id: "27205",
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: "/oYuLEW9Wrqi8hUY2P31vY49yTj1.jpg",
    vote_average: 8.4,
    release_date: "2010-07-16",
    genre_ids: [28, 878, 12],
  },
  {
    id: "157336",
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    vote_average: 8.4,
    release_date: "2014-11-05",
    genre_ids: [12, 18, 878],
  },
  {
    id: "155",
    title: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    vote_average: 8.5,
    release_date: "2008-07-16",
    genre_ids: [18, 28, 80, 53],
  },
  {
    id: "693134",
    title: "Dune: Part Two",
    overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    poster_path: "/1pdfLPoWBV9DJwUfZw2d2grizYp.jpg",
    vote_average: 8.3,
    release_date: "2024-02-27",
    genre_ids: [878, 12],
  },
  {
    id: "872585",
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "/8Gxv8gSFCU0XGDykEGvjW21a2Y1.jpg",
    vote_average: 8.1,
    release_date: "2023-07-19",
    genre_ids: [18, 36],
  },
  {
    id: "569094",
    title: "Spider-Man: Across the Spider-Verse",
    overview: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj7sY4E.jpg",
    vote_average: 8.4,
    release_date: "2023-05-31",
    genre_ids: [16, 28, 12, 878],
  },
];

const MovieRouletteModal = ({ isOpen, onClose }) => {
  const { data: popularPage1 } = useGetPopularMoviesQuery(1);
  const { data: popularPage2 } = useGetPopularMoviesQuery(2);
  const { data: topRatedData } = useGetTopRatedMoviesQuery(1);

  const [selectedGenre, setSelectedGenre] = useState("all");
  const [minRating, setMinRating] = useState(7.0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [chosenMovie, setChosenMovie] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  if (!isOpen) return null;

  // Build candidate pool from API responses or static fallback array
  const rawPool = [
    ...(Array.isArray(popularPage1?.results) ? popularPage1.results : []),
    ...(Array.isArray(popularPage1?.movies) ? popularPage1.movies : []),
    ...(Array.isArray(popularPage1) ? popularPage1 : []),
    ...(Array.isArray(popularPage2?.results) ? popularPage2.results : []),
    ...(Array.isArray(topRatedData?.results) ? topRatedData.results : []),
  ];

  const fullMoviesPool = rawPool.length > 0 ? rawPool : FALLBACK_MOVIES;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setChosenMovie(null);
    setIsResultOpen(false);

    // 1. Pick a random winning slot index on the 12-slot wheel
    const winningSlotIdx = Math.floor(Math.random() * ROULETTE_GENRES.length);

    // 2. Exact spinner physics: calculate exact rotation to align winningSlotIdx to top pointer (0deg)
    const slotAngle = 360 / ROULETTE_GENRES.length;
    const currentFullTurns = Math.ceil(wheelRotation / 360);
    const extraTurns = 6 + Math.floor(Math.random() * 3); // 6 to 8 full 360 turns
    const targetOffset = (360 - winningSlotIdx * slotAngle) % 360;
    const finalTargetRotation = currentFullTurns * 360 + extraTurns * 360 + targetOffset;

    setWheelRotation(finalTargetRotation);

    // 3. Filter movies pool based on selected genre & rating
    const slotObj = ROULETTE_GENRES[winningSlotIdx];
    const targetGenreId = slotObj.id === "all" || slotObj.id === "all-top" ? selectedGenre : slotObj.id;

    let candidates = fullMoviesPool.filter((m) => {
      const rating = m.vote_average || m.rating || 7.5;
      const ratingOk = rating >= minRating;
      const genreOk =
        targetGenreId === "all" ||
        targetGenreId === "all-top" ||
        (m.genre_ids && m.genre_ids.includes(Number(targetGenreId))) ||
        (m.genres && m.genres.some((g) => String(g.id || g._id) === String(targetGenreId)));
      return ratingOk && genreOk;
    });

    if (candidates.length === 0) candidates = fullMoviesPool;

    // 4. Truly random selection from candidates pool
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const pickedMovie = candidates[randomIndex] || fullMoviesPool[0] || FALLBACK_MOVIES[0];

    // 5. Open result modal precisely when the 3.2s wheel deceleration completes
    setTimeout(() => {
      setChosenMovie(pickedMovie);
      setIsSpinning(false);
      setIsResultOpen(true);
    }, 3200);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overscroll-contain animate-hero-entry">
        {/* Perfectly sized & rigidly pinned responsive container */}
        <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col my-auto overscroll-contain">
          {/* Background Ambient Glows */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-red-600/15 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition z-20 border border-zinc-700/60"
          >
            <FaTimes className="text-sm" />
          </button>

          {/* Header Title */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg text-lg font-bold flex-shrink-0">
              <FaDice className={isSpinning ? "animate-spin" : ""} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Movie Roulette</span>
                <FaFire className="text-amber-400 text-xs" />
              </h2>
              <p className="text-xs text-gray-400">Randomly select your next movie pick.</p>
            </div>
          </div>

          {/* ================= 3D ROULETTE WHEEL ================= */}
          <div className="flex flex-col items-center justify-center my-2 py-2 relative flex-shrink-0">
            {/* Pointer Arrow - Aligned directly at Top 0deg */}
            <div className="absolute top-0 z-30 transform -translate-y-1 flex flex-col items-center">
              <div className="w-4 h-5 bg-gradient-to-b from-amber-400 to-red-600 clip-path-triangle shadow-lg shadow-red-600/40" />
            </div>

            {/* Wheel Container with synchronized rotation */}
            <div
              className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-8 border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative flex items-center justify-center shadow-2xl transition-transform duration-[3200ms] ease-out"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {ROULETTE_GENRES.map((g, index) => {
                const angle = (index * 360) / ROULETTE_GENRES.length;
                const Icon = g.icon;
                const isSelected = selectedGenre === g.id;

                return (
                  <div
                    key={`${g.id}-${index}`}
                    className="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-78px) rotate(-${angle}deg)`,
                      background: isSelected
                        ? "linear-gradient(135deg, #e50914, #ff2a54)"
                        : index % 2 === 0
                        ? "#18181b"
                        : "#27272a",
                      color: isSelected ? "#ffffff" : "#a1a1aa",
                      border: isSelected ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <Icon className="text-[10px]" />
                  </div>
                );
              })}

              {/* Center Button */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-red-700 flex flex-col items-center justify-center text-white shadow-xl border-4 border-zinc-900 z-10">
                <FaDice className={`text-lg ${isSpinning ? "animate-spin" : ""}`} />
                <span className="text-[8px] font-black tracking-tighter uppercase mt-0.5">
                  {isSpinning ? "SPINNING" : "SPIN"}
                </span>
              </div>
            </div>
          </div>

          {/* Filter Controls Bar */}
          <div className="space-y-3 mb-4 bg-zinc-950/70 p-3.5 rounded-2xl border border-zinc-800/80">
            <div>
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5 mb-2">
                <FaFilter className="text-red-500" />
                <span>Genre Filter</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                {ROULETTE_GENRES.map((g) => {
                  const Icon = g.icon;
                  const active = selectedGenre === g.id;

                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGenre(g.id)}
                      className={`text-xs px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1 ${
                        active
                          ? "bg-red-600 text-white border-red-500 font-bold shadow-md"
                          : "bg-zinc-900 text-gray-400 border-zinc-800 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <Icon className="text-[9px]" />
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-300 mb-1">
                <span className="flex items-center gap-1">
                  <FaStar className="text-amber-400 text-[10px]" />
                  <span>Minimum Rating</span>
                </span>
                <span className="text-amber-400 font-black text-xs">{minRating.toFixed(1)}+</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.0"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-red-600 cursor-pointer bg-zinc-800 rounded-lg h-1.5"
              />
            </div>
          </div>

          {/* Spin Trigger Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-xs tracking-wide flex-shrink-0"
          >
            <FaDice className={`text-base ${isSpinning ? "animate-spin" : ""}`} />
            <span>{isSpinning ? "Selecting Film..." : "Spin Roulette Wheel"}</span>
          </button>
        </div>
      </div>

      {/* Dedicated Winner Result Modal Popup with z-[100] top priority */}
      <MovieRouletteResultModal
        isOpen={isResultOpen}
        movie={chosenMovie}
        onClose={() => setIsResultOpen(false)}
        onSpinAgain={handleSpin}
      />
    </>
  );
};

export default MovieRouletteModal;
