import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";

import MovieTabs from "./MovieTabs";
import TrailerModal from "../../component/TrailerModal";

import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../redux/features/watchlist/watchlistSlice";

const MovieDetails = () => {
  const { id: movieId } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { data: movie, refetch } = useGetSpecificMovieQuery(movieId);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const watchlist = useSelector((state) => state.watchlist.movies);

  const isInWatchlist = watchlist.some((item) => item._id === movie?._id);

  const watchlistHandler = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie._id));
      toast.success("Removed from Watchlist");
    } else {
      dispatch(addToWatchlist(movie));
      toast.success("Added to Watchlist");
    }
  };

  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        id: movieId,
        rating,
        comment,
      }).unwrap();

      refetch();

      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <h1 className="text-white text-3xl font-bold">Loading Movie...</h1>
      </div>
    );
  }

  return (
    <>
      {/* ================= HERO ================= */}

      <section className="relative h-[90vh] w-full overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.name}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        <div className="absolute inset-0 bg-black/55"></div>

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        {/* Back Button */}

        <div className="absolute top-8 left-8 z-30">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105 px-6 py-3 rounded-lg font-semibold text-white shadow-xl"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Hero Content */}

        <div className="relative z-20 max-w-7xl mx-auto h-full flex items-center px-10">
          {/* Poster */}

          <img
            src={movie.poster}
            alt={movie.name}
            className="w-[330px] rounded-2xl shadow-2xl"
          />

          {/* Right Side */}

          <div className="ml-16 max-w-4xl">
            <h1 className="text-white text-7xl font-black leading-tight">
              {movie.name}
            </h1>

            {/* Movie Meta */}

            <div className="flex flex-wrap items-center gap-3 mt-8 text-xl text-gray-300">
              <span className="text-yellow-400 font-bold">
                ⭐ {movie.rating?.toFixed(1)}
              </span>

              <span>•</span>

              <span>{movie.year}</span>

              <span>•</span>

              <span>{movie.runtime} min</span>

              <span>•</span>

              <span>{movie.language?.toUpperCase()}</span>
            </div>

            {/* Genres */}

            <div className="flex flex-wrap gap-4 mt-8">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-red-600 px-5 py-2 rounded-full text-white font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Buttons */}

            <div className="flex gap-5 mt-10">
              {movie.trailer && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105 px-10 py-4 rounded-xl text-lg font-bold shadow-xl"
                >
                  ▶ Play Trailer
                </button>
              )}

              <button
                onClick={watchlistHandler}
                className={`px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 shadow-xl ${
                  isInWatchlist
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {isInWatchlist ? "✓ In Watchlist" : "♡ Add to Watchlist"}
              </button>
            </div>

            {/* Overview */}

            <div className="mt-12">
              <h2 className="text-white text-3xl font-bold mb-6">Overview</h2>

              <p className="text-gray-300 text-xl leading-10">
                {movie.overview}
              </p>
            </div>

            {/* Movie Information */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              <div className="bg-[#151515]/90 backdrop-blur-md p-6 rounded-2xl">
                <p className="text-gray-400 text-sm">Director</p>

                <h3 className="text-white text-xl mt-2">
                  {movie.director || "Unknown"}
                </h3>
              </div>

              <div className="bg-[#151515]/90 backdrop-blur-md p-6 rounded-2xl">
                <p className="text-gray-400 text-sm">Language</p>

                <h3 className="text-white text-xl mt-2 uppercase">
                  {movie.language}
                </h3>
              </div>

              <div className="bg-[#151515]/90 backdrop-blur-md p-6 rounded-2xl">
                <p className="text-gray-400 text-sm">Release Date</p>

                <h3 className="text-white text-xl mt-2">{movie.releaseDate}</h3>
              </div>

              <div className="bg-[#151515]/90 backdrop-blur-md p-6 rounded-2xl">
                <p className="text-gray-400 text-sm">Status</p>

                <h3 className="text-white text-xl mt-2">{movie.status}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= CAST ================= */}

      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-10">
          <h2 className="text-white text-4xl font-bold mb-10">Top Cast</h2>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {movie.cast?.map((actor) => (
              <div key={actor.id} className="w-[180px] flex-shrink-0 group">
                <img
                  src={
                    actor.image || "https://placehold.co/185x278?text=No+Image"
                  }
                  alt={actor.name}
                  className="h-[270px] w-full object-cover rounded-2xl transition duration-300 group-hover:scale-105"
                />

                <h3 className="text-white font-bold mt-4">{actor.name}</h3>

                <p className="text-gray-400 text-sm">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SIMILAR MOVIES ================= */}

      <section className="bg-black py-10">
        <div className="max-w-7xl mx-auto px-10">
          <h2 className="text-white text-4xl font-bold mb-10">
            Similar Movies
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {movie.similar?.map((item) => (
              <Link
                key={item.id}
                to={`/movies/${item.id}`}
                className="w-[180px] flex-shrink-0 group"
              >
                <img
                  src={item.poster}
                  alt={item.name}
                  className="rounded-2xl transition duration-300 group-hover:scale-105"
                />

                <h3 className="text-white mt-4 font-semibold group-hover:text-red-500 transition">
                  {item.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}

      <section className="bg-black pb-24">
        <div className="max-w-7xl mx-auto px-10 border-t border-gray-800 pt-16">
          <MovieTabs
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>
      </section>

      {/* ================= TRAILER MODAL ================= */}

      <TrailerModal
        trailer={movie.trailer}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />
    </>
  );
};

export default MovieDetails;
