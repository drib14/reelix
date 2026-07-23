import { Link } from "react-router-dom";
import { FaPlay, FaStar, FaTv, FaFilm } from "react-icons/fa";
import { getCountryFlag } from "../../utils/countryUtils";

const MovieCard = ({ movie }) => {
  const isTv = movie.media_type === "tv";
  const originCountryCode = movie.originCountry || (movie.origin_country && movie.origin_country[0]) || "";

  const getRatingBadge = (rating) => {
    if (!rating) return null;
    const num = Number(rating);
    let colorClass = "bg-red-600/90 text-white border-red-500/40";
    if (num >= 8.0) colorClass = "bg-emerald-600/90 text-white border-emerald-400/40";
    else if (num >= 6.5) colorClass = "bg-amber-500/90 text-white border-amber-400/40";

    return (
      <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold border backdrop-blur-md shadow-md flex items-center gap-1 ${colorClass}`}>
        <FaStar className="text-[9px]" />
        <span>{num.toFixed(1)}</span>
      </span>
    );
  };

  return (
    <Link
      to={`/movies/${movie._id || movie.id}${isTv ? "?type=tv" : ""}`}
      className="group relative block rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:-translate-y-2 hover:border-red-600/60 hover:shadow-[0_12px_30px_-5px_rgba(229,9,20,0.4)] flex flex-col h-full"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={movie.image || movie.poster || "https://placehold.co/500x750?text=No+Poster"}
          alt={movie.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          {movie.rating ? getRatingBadge(movie.rating) : <div />}
          <div className="flex items-center gap-1 ml-auto">
            {originCountryCode && (
              <span className="bg-black/80 text-white text-[12px] px-1.5 py-0.5 rounded-md backdrop-blur-md border border-white/10 shadow" title={`Origin Country: ${originCountryCode}`}>
                {getCountryFlag(originCountryCode)}
              </span>
            )}

            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md backdrop-blur-md border flex items-center gap-1 ${
              isTv
                ? "bg-purple-600/90 text-white border-purple-400/40"
                : "bg-blue-600/90 text-white border-blue-400/40"
            }`}>
              {isTv ? <FaTv className="text-[8px]" /> : <FaFilm className="text-[8px]" />}
              <span>{isTv ? "TV" : "Movie"}</span>
            </span>

            {movie.year && (
              <span className="bg-black/80 text-gray-200 text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10">
                {movie.year}
              </span>
            )}
          </div>
        </div>

        {/* Hover Overlay with Play Icon */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center pl-0.5 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <FaPlay className="text-sm" />
          </div>
        </div>
      </div>

      {/* Info Content - Minimalist Title Only */}
      <div className="p-3 bg-zinc-900/90 border-t border-zinc-800/80">
        <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
          {movie.name}
        </h3>
      </div>
    </Link>
  );
};

export default MovieCard;