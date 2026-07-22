import { useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaStar, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mb-14 relative group/section">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>{title}</span>
        </h2>

        <Link
          to="/movies"
          className="text-sm sm:text-base text-red-500 hover:text-red-400 font-semibold transition flex items-center gap-2 group"
        >
          <span>Explore All</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
        </Link>
      </div>

      {/* Row Container with Scroll Controls */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-red-600 text-white p-3.5 rounded-r-xl border-r border-t border-b border-zinc-700/60 backdrop-blur-md opacity-0 group-hover/section:opacity-100 transition-all duration-300 shadow-xl hidden sm:flex items-center justify-center"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-sm" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-red-600 text-white p-3.5 rounded-l-xl border-l border-t border-b border-zinc-700/60 backdrop-blur-md opacity-0 group-hover/section:opacity-100 transition-all duration-300 shadow-xl hidden sm:flex items-center justify-center"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-sm" />
        </button>

        {/* Horizontal Carousel */}
        <div
          ref={rowRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth px-1"
        >
          {movies?.map((movie, index) => (
            <Link
              key={movie._id || index}
              to={`/movies/${movie._id}`}
              className="relative flex-shrink-0 group/card cursor-pointer"
            >
              {/* Rank Number (Netflix Top 10 style) */}
              <span className="absolute -left-3 bottom-1 text-7xl sm:text-8xl font-black text-black opacity-80 [-webkit-text-stroke:2px_rgba(255,255,255,0.7)] z-20 pointer-events-none select-none">
                {index + 1}
              </span>

              {/* Poster Card Container */}
              <div className="relative w-[150px] sm:w-[200px] h-[225px] sm:h-[300px] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-300 group-hover/card:scale-105 group-hover/card:border-red-600/60 group-hover/card:shadow-[0_10px_25px_-5px_rgba(229,9,20,0.4)] ml-3">
                <img
                  src={movie.image || movie.poster}
                  alt={movie.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                  loading="lazy"
                />

                {/* Top Rating Badge */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                  {movie.rating && (
                    <span className="bg-black/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-md border border-amber-400/30 flex items-center gap-1">
                      <FaStar className="text-[10px]" />
                      <span>{movie.rating}</span>
                    </span>
                  )}
                </div>

                {/* Hover Play Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center pl-0.5 mb-2 shadow-lg transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                    <FaPlay className="text-sm" />
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">
                    {movie.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                    <span>{movie.year}</span>
                    {movie.genre?.name && (
                      <>
                        <span>•</span>
                        <span className="text-red-400">{movie.genre.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieRow;