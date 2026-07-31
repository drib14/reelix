import { Link } from "react-router-dom";
import { FaStar, FaPlay, FaArrowRight, FaTv } from "react-icons/fa";
import { REELIX_FALLBACK_POSTER } from "../../utils/assets";

const MovieCard = ({ movie }) => {
  const isTV = movie.media_type === "tv";
  const detailLink = `/movies/${movie.id}${isTV ? "?type=tv" : ""}`;
  const posterSrc = movie.poster || movie.image || movie.backdrop || REELIX_FALLBACK_POSTER;

  return (
    <div className="block bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden hover:border-red-500 hover:shadow-xl transition-all duration-300">
      <div className="flex">
        {/* Poster */}
        <img
          src={posterSrc}
          alt={movie.title || "Poster"}
          className="w-28 h-40 object-cover flex-shrink-0"
          onError={(e) => {
            e.target.src = REELIX_FALLBACK_POSTER;
          }}
        />

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 p-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-lg line-clamp-1">
                {movie.title}
              </h3>
              {isTV && (
                <span className="bg-purple-600/30 text-purple-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-500/40 flex items-center gap-1 flex-shrink-0">
                  <FaTv className="text-[8px]" />
                  TV
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <FaStar className="text-xs" />
                <span>{movie.rating ? movie.rating.toFixed(1) : "N/A"}</span>
              </span>

              <span>
                {movie.releaseDate
                  ? movie.releaseDate.substring(0, 4)
                  : "N/A"}
              </span>
            </div>

            <p className="text-gray-300 text-sm mt-2 line-clamp-2">
              {movie.overview || "No overview available."}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Link
              to={detailLink}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-lg transition font-bold flex items-center gap-1.5"
            >
              <FaPlay className="text-[9px]" />
              <span>Stream Now</span>
            </Link>

            <Link
              to={detailLink}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-gray-300 text-xs px-3 py-2 rounded-lg transition font-semibold flex items-center gap-1.5"
            >
              <span>Details</span>
              <FaArrowRight className="text-[9px]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;