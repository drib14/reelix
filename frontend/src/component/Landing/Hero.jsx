import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlay,
  FaStar,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaFire,
} from "react-icons/fa";
import { useGetTrendingMoviesQuery } from "../../redux/api/movies";
import MoviePlayerModal from "../MoviePlayerModal";
import HeroSkeleton from "../Skeletons/HeroSkeleton";

const Hero = () => {
  const { data: trendingMovies = [], isLoading } = useGetTrendingMoviesQuery();
  const spotlightMovies = trendingMovies.slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideKey, setSlideKey] = useState(0); // Trigger re-animation on slide change
  const [playerConfig, setPlayerConfig] = useState({
    isOpen: false,
    movie: null,
    isTrailer: false,
  });

  // Auto rotate hero spotlight every 6 seconds
  useEffect(() => {
    if (spotlightMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % spotlightMovies.length;
        setSlideKey(next);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [spotlightMovies.length]);

  const handleManualSlide = (nextIndex) => {
    setCurrentIndex(nextIndex);
    setSlideKey(nextIndex);
  };

  if (isLoading) {
    return <HeroSkeleton />;
  }

  const activeMovie = spotlightMovies[currentIndex] || {
    name: "Stream Beyond Imagination",
    overview: "Explore thousands of blockbuster movies, TV series, and AI-curated picks instantly in Ultra HD.",
    rating: 8.8,
    year: 2024,
    poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1920&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1920&auto=format&fit=crop",
  };

  const isTv = activeMovie?.media_type === "tv";

  return (
    <>
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-black select-none">
        {/* Dynamic Background Image with Crossfade */}
        {spotlightMovies.map((movie, idx) => (
          <div
            key={movie._id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? "opacity-45 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={movie.backdrop || movie.poster}
              alt={movie.name}
              className="w-full h-full object-cover filter blur-sm transition-transform duration-1000"
            />
          </div>
        ))}

        {/* Fallback Image */}
        {spotlightMovies.length === 0 && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1920&auto=format&fit=crop')",
            }}
          />
        )}

        {/* Dark Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-[#0d0d0e]/75 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0e] via-[#0d0d0e]/60 to-transparent"></div>

        {/* Carousel Navigation Arrows */}
        {spotlightMovies.length > 1 && (
          <>
            <button
              onClick={() =>
                handleManualSlide(
                  (currentIndex - 1 + spotlightMovies.length) % spotlightMovies.length
                )
              }
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-red-600 border border-white/20 text-white flex items-center justify-center transition backdrop-blur-md shadow-2xl hover:scale-110"
              aria-label="Previous Featured Movie"
            >
              <FaChevronLeft className="text-base" />
            </button>
            <button
              onClick={() =>
                handleManualSlide((currentIndex + 1) % spotlightMovies.length)
              }
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-red-600 border border-white/20 text-white flex items-center justify-center transition backdrop-blur-md shadow-2xl hover:scale-110"
              aria-label="Next Featured Movie"
            >
              <FaChevronRight className="text-base" />
            </button>
          </>
        )}

        {/* Main Hero Content Container */}
        <div
          key={slideKey}
          className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col lg:flex-row items-center justify-between gap-10"
        >
          {/* Left Column Text (Cool Keyframe Slide-Up Entry) */}
          <div className="flex-1 text-center lg:text-left max-w-2xl animate-hero-entry">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-red-950/70 border border-red-500/40 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 text-xs sm:text-sm text-red-400 font-extrabold tracking-wide uppercase shadow-lg shadow-red-950/50">
              <FaFire className="text-red-500 animate-bounce" />
              <span>Spotlight #{currentIndex + 1} Trending {isTv ? "TV Series" : "Movie"}</span>
            </div>

            {/* Title */}
            <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-4 drop-shadow-2xl line-clamp-2">
              {activeMovie.name}
            </h1>

            {/* Rating & Meta Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6 text-sm font-semibold">
              {activeMovie.rating && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-lg font-extrabold flex items-center gap-1.5 shadow-md">
                  <FaStar className="text-xs" />
                  <span>{Number(activeMovie.rating).toFixed(1)} TMDB</span>
                </span>
              )}

              <span className="bg-red-600/30 text-red-300 border border-red-500/40 px-3 py-1 rounded-lg font-bold text-xs uppercase">
                {isTv ? "TV Series" : "Movie"}
              </span>

              {activeMovie.year && (
                <span className="bg-zinc-800/80 text-gray-200 border border-zinc-700 px-3 py-1 rounded-lg text-xs">
                  {activeMovie.year}
                </span>
              )}

              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-lg text-xs font-bold">
                1080p Ultra HD
              </span>
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 line-clamp-3">
              {activeMovie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() =>
                  setPlayerConfig({
                    isOpen: true,
                    movie: activeMovie,
                    isTrailer: false,
                  })
                }
                className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 transition duration-300 rounded-2xl text-white text-base sm:text-lg font-extrabold shadow-xl shadow-red-600/40 hover:scale-105 flex items-center justify-center gap-3 group"
              >
                <FaPlay className="text-sm pl-0.5" />
                <span>Stream Now</span>
              </button>

              <Link
                to={`/movies/${activeMovie._id || activeMovie.id}${isTv ? "?type=tv" : ""}`}
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 transition duration-300 rounded-2xl text-white text-base sm:text-lg font-bold backdrop-blur-md hover:scale-105 flex items-center justify-center gap-2.5"
              >
                <span>View Details</span>
                <FaArrowRight className="text-xs text-red-500" />
              </Link>
            </div>
          </div>

          {/* Right Featured Poster Spotlight Card (Cool Scale-Up Animation) */}
          <div className="hidden lg:block relative flex-shrink-0 w-[300px] h-[450px] rounded-3xl overflow-hidden border-2 border-zinc-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-zinc-900 group animate-banner-poster">
            <img
              src={activeMovie.poster}
              alt={activeMovie.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80"></div>

            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">
                FEATURED SELECTION
              </span>
              <h3 className="text-white font-bold text-lg line-clamp-1 mt-0.5">
                {activeMovie.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        {spotlightMovies.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {spotlightMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleManualSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-red-600"
                    : "w-2.5 bg-zinc-700 hover:bg-zinc-500"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Embedded Streaming Player Modal */}
      {playerConfig.isOpen && (
        <MoviePlayerModal
          isOpen={playerConfig.isOpen}
          onClose={() => setPlayerConfig((prev) => ({ ...prev, isOpen: false }))}
          title={playerConfig.movie?.name}
          videoUrl={playerConfig.movie?.videoUrl}
          isTrailer={playerConfig.isTrailer}
          movie={playerConfig.movie}
        />
      )}
    </>
  );
};

export default Hero;