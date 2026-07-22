import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="block bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden hover:border-red-500 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex">
        {/* Poster */}

        <img
          src={movie.poster}
          alt={movie.title}
          className="w-28 h-40 object-cover flex-shrink-0"
        />

        {/* Content */}

        <div className="flex flex-col justify-between flex-1 p-4">
          <div>
            <h3 className="text-white font-bold text-lg">
              {movie.title}
            </h3>

            <div className="flex gap-4 mt-2 text-sm text-gray-400">
              <span>⭐ {movie.rating.toFixed(1)}</span>

              <span>
                {movie.releaseDate
                  ? movie.releaseDate.substring(0, 4)
                  : "N/A"}
              </span>
            </div>

            <p className="text-gray-300 text-sm mt-3 line-clamp-3">
              {movie.overview || "No overview available."}
            </p>
          </div>

          <button className="mt-4 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg w-fit transition">
            View Details →
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;