import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWatchlist } from "../../redux/features/watchlist/watchlistSlice";

const Watchlist = () => {
  const dispatch = useDispatch();

  const watchlist = useSelector(
    (state) => state.watchlist.movies
  );

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}

      <div className="max-w-7xl mx-auto px-10 py-10 flex items-center justify-between">

        <h1 className="text-5xl font-bold">
          ❤️ My Watchlist
        </h1>

        <Link
          to="/"
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
        >
          ← Back Home
        </Link>

      </div>

      {/* Empty */}

      {watchlist.length === 0 ? (
        <div className="text-center mt-40">

          <h2 className="text-3xl font-bold mb-4">
            Your Watchlist is Empty
          </h2>

          <p className="text-gray-400 mb-8">
            Start adding your favorite movies.
          </p>

          <Link
            to="/"
            className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold"
          >
            Browse Movies
          </Link>

        </div>
      ) : (

        <div className="max-w-7xl mx-auto px-10 pb-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {watchlist.map((movie) => (

            <div
              key={movie._id}
              className="bg-[#141414] rounded-xl overflow-hidden shadow-lg"
            >

              <Link to={`/movies/${movie._id}`}>

                <img
                  src={movie.poster}
                  alt={movie.name}
                  className="w-full h-[340px] object-cover"
                />

              </Link>

              <div className="p-4">

                <h3 className="font-bold text-lg line-clamp-2">
                  {movie.name}
                </h3>

                <p className="text-gray-400 mt-2">
                  {movie.year}
                </p>

                <button
                  onClick={() =>
                    dispatch(removeFromWatchlist(movie._id))
                  }
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Watchlist;