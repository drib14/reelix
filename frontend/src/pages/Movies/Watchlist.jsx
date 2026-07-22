import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaArrowLeft, FaTrash, FaFilm, FaCompass } from "react-icons/fa";

import Navbar from "../../component/Landing/Navbar";
import Footer from "../../component/Landing/Footer";
import { removeFromWatchlist } from "../../redux/features/watchlist/watchlistSlice";

const Watchlist = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.movies);

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      <Navbar />

      <div className="pt-28 pb-10 px-4 sm:px-8 max-w-7xl mx-auto w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
              <FaHeart className="text-red-600 text-3xl sm:text-4xl" />
              <span>My Watchlist</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Your saved movies list ({watchlist.length} {watchlist.length === 1 ? "title" : "titles"})
            </p>
          </div>

          <Link
            to="/movies"
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 transition px-5 py-2.5 rounded-xl font-bold text-white text-sm"
          >
            <FaArrowLeft className="text-xs" />
            <span>Explore Catalog</span>
          </Link>
        </div>

        {/* Empty Watchlist View */}
        {watchlist.length === 0 ? (
          <div className="py-24 text-center bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 text-2xl mb-4 shadow-xl">
              <FaHeart className="text-gray-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Your Watchlist is Empty
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-md">
              Save your favorite movies to watch later by clicking the Watchlist button on any movie details page.
            </p>
            <Link
              to="/movies"
              className="bg-red-600 hover:bg-red-700 transition px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <FaCompass className="text-base" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        ) : (
          /* Watchlist Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {watchlist.map((movie) => (
              <div
                key={movie._id || movie.id}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:border-red-600/60 hover:shadow-[0_10px_25px_-5px_rgba(229,9,20,0.4)] flex flex-col h-full"
              >
                <Link to={`/movies/${movie._id || movie.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={movie.poster}
                    alt={movie.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {movie.year && (
                    <span className="absolute top-3 right-3 bg-black/80 text-gray-200 text-xs font-semibold px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10">
                      {movie.year}
                    </span>
                  )}
                </Link>

                <div className="p-4 flex flex-col justify-between flex-1 bg-zinc-900/90">
                  <div>
                    <Link to={`/movies/${movie._id || movie.id}`} className="hover:text-red-400 transition-colors">
                      <h3 className="font-bold text-base text-white line-clamp-1">
                        {movie.name}
                      </h3>
                    </Link>
                  </div>

                  <button
                    onClick={() => dispatch(removeFromWatchlist(movie._id || movie.id))}
                    className="mt-4 w-full bg-red-950/60 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 hover:border-red-600 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <FaTrash className="text-xs" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Watchlist;