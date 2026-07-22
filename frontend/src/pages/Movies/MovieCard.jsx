import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const getRatingColor = (rating) => {
    if (rating >= 8.5) return "text-green-400";
    if (rating >= 7) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group block rounded-2xl overflow-hidden bg-[#181818] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_15px_40px_rgba(229,9,20,0.35)]"
    >
      {/* Poster */}

      <div className="relative overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.name}
          className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      </div>

      {/* Details */}

      <div className="p-5">
        <div className="flex items-center justify-between">
          <span
            className={`font-bold ${getRatingColor(movie.rating)}`}
          >
            ⭐ {movie.rating?.toFixed(1)}
          </span>

          <span className="text-gray-400 text-sm">
            📅 {movie.year}
          </span>
        </div>

        <h2 className="text-white font-bold text-xl mt-3 line-clamp-2">
          {movie.name}
        </h2>

        {/* Overview (appears on hover) */}

        <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500">
          <p className="text-gray-400 text-sm leading-6 mt-4 line-clamp-3">
            {movie.overview}
          </p>

          <div className="mt-5 flex items-center text-red-500 font-semibold group-hover:text-red-400 transition">
            ▶ View Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;