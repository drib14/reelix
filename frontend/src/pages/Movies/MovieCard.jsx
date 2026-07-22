import { Link } from "react-router-dom";
import { FaPlay, FaStar } from "react-icons/fa";

const MovieCard = ({ movie }) => {
  const getRatingBadge = (rating) => {
    if (!rating) return null;
    const num = Number(rating);
    let colorClass = "bg-red-600/90 text-white border-red-500/40";
    if (num >= 8.0) colorClass = "bg-emerald-600/90 text-white border-emerald-400/40";
    else if (num >= 6.5) colorClass = "bg-amber-500/90 text-white border-amber-400/40";

    return (
      <span className={`px-2 py-0.5 rounded-md text-xs font-bold border backdrop-blur-md shadow-md flex items-center gap-1 ${colorClass}`}>
        <FaStar className="text-[10px]" />
        <span>{num.toFixed(1)}</span>
      </span>
    );
  };

  return (
    <Link
      to={`/movies/${movie._id || movie.id}`}
      className="group relative block rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:-translate-y-2 hover:border-red-600/60 hover:shadow-[0_12px_30px_-5px_rgba(229,9,20,0.4)] flex flex-col h-full"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={movie.image || movie.poster}
          alt={movie.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          {movie.rating && getRatingBadge(movie.rating)}
          {movie.year && (
            <span className="bg-black/80 text-gray-200 text-xs font-semibold px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10 ml-auto">
              {movie.year}
            </span>
          )}
        </div>

        {/* Netflix-style Hover Overlay with Play Icon */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center pl-0.5 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <FaPlay className="text-base" />
          </div>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-zinc-900/90">
        <div>
          <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.name}
          </h3>
          {movie.genre?.name && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {movie.genre.name}
            </p>
          )}
        </div>

        {movie.overview && (
          <p className="text-gray-400 text-xs line-clamp-2 mt-2 leading-relaxed">
            {movie.overview}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;