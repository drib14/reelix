import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";

import MovieTabs from "./MovieTabs";
import MoviePlayerModal from "../../component/MoviePlayerModal";

import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../redux/features/watchlist/watchlistSlice";

const MovieDetails = () => {
  const { id: movieId } = useParams();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  
  const [playerConfig, setPlayerConfig] = useState({
    isOpen: false,
    title: "",
    videoUrl: "",
    isTrailer: false,
  });

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

  const [createReview, { isLoading: loadingMovieReview }] = useAddMovieReviewMutation();

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
      <div className="min-h-screen bg-[#0d0d0e] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fallback high definition 1080p open stream if movie does not have custom video URL
  const defaultVideoStream = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen w-full overflow-hidden pt-20">
        {/* Background Backdrop */}
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.name}
          className="absolute inset-0 w-full h-full object-cover scale-105 filter blur-sm opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-[#0d0d0e]/80 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0e] via-[#0d0d0e]/70 to-transparent"></div>

        {/* Back Navigation */}
        <div className="absolute top-24 left-6 sm:left-12 z-30">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 transition-all duration-300 px-5 py-2.5 rounded-xl font-medium text-white text-sm backdrop-blur-md shadow-lg"
          >
            ← Back to Catalog
          </Link>
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-20 max-w-7xl mx-auto min-h-[85vh] flex items-center px-4 sm:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14 w-full">
            
            {/* Poster Card */}
            <div className="flex-shrink-0 w-[240px] sm:w-[300px] lg:w-[340px] rounded-2xl overflow-hidden border border-zinc-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-zinc-900">
              <img
                src={movie.poster}
                alt={movie.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {movie.name}
              </h1>

              {/* Meta Stats Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4 text-sm sm:text-base text-gray-300 font-medium">
                {movie.rating && (
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-md font-bold flex items-center gap-1">
                    ★ {movie.rating?.toFixed(1)}
                  </span>
                )}
                {movie.year && <span>• {movie.year}</span>}
                {movie.runtime && <span>• {movie.runtime} min</span>}
                {movie.language && (
                  <span className="uppercase text-xs bg-zinc-800 px-2.5 py-1 rounded-md text-gray-300 border border-zinc-700">
                    {movie.language}
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-6">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id || genre._id}
                    className="bg-red-950/60 border border-red-500/30 px-3.5 py-1.5 rounded-full text-red-400 text-xs font-semibold"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Streaming Play Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8">
                {/* Full Movie Play Button */}
                <button
                  onClick={() => {
                    setPlayerConfig({
                      isOpen: true,
                      title: `${movie.name} (Full Movie)`,
                      videoUrl: movie.videoUrl || defaultVideoStream,
                      isTrailer: false,
                    });
                  }}
                  className="bg-red-600 hover:bg-red-700 transition duration-300 rounded-xl px-8 py-4 text-white text-base sm:text-lg font-bold shadow-xl shadow-red-600/30 flex items-center gap-2 group transform hover:scale-105"
                >
                  <span className="text-xl">▶</span>
                  <span>Play Full Movie</span>
                </button>

                {/* Trailer Button */}
                {movie.trailer && (
                  <button
                    onClick={() => {
                      setPlayerConfig({
                        isOpen: true,
                        title: `${movie.name} (Official Trailer)`,
                        videoUrl: movie.trailer,
                        isTrailer: true,
                      });
                    }}
                    className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 transition duration-300 rounded-xl px-6 py-4 text-white text-base sm:text-lg font-bold flex items-center gap-2 transform hover:scale-105"
                  >
                    <span>🎬 Watch Trailer</span>
                  </button>
                )}

                {/* Watchlist Button */}
                <button
                  onClick={watchlistHandler}
                  className={`px-6 py-4 rounded-xl text-base sm:text-lg font-bold transition duration-300 border flex items-center gap-2 transform hover:scale-105 ${
                    isInWatchlist
                      ? "bg-zinc-800/80 border-zinc-700 text-gray-300 hover:bg-zinc-700"
                      : "bg-white text-black border-white hover:bg-gray-200"
                  }`}
                >
                  {isInWatchlist ? "✓ Saved" : "♡ Watchlist"}
                </button>
              </div>

              {/* Overview */}
              <div className="mt-8 text-left max-w-3xl">
                <h3 className="text-white text-lg font-bold mb-2">Overview</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 text-left">
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Director</p>
                  <p className="text-white font-bold text-sm mt-1 truncate">
                    {movie.director || "N/A"}
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Language</p>
                  <p className="text-white font-bold text-sm mt-1 uppercase">
                    {movie.language || "EN"}
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Release Date</p>
                  <p className="text-white font-bold text-sm mt-1 truncate">
                    {movie.releaseDate || movie.year || "N/A"}
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Quality</p>
                  <p className="text-emerald-400 font-bold text-sm mt-1">
                    1080p Ultra HD
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= CAST ================= */}
      {movie.cast?.length > 0 && (
        <section className="bg-[#0d0d0e] py-12 border-t border-zinc-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <h2 className="text-white text-2xl sm:text-3xl font-extrabold mb-6">Top Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {movie.cast.map((actor, idx) => (
                <div key={actor.id || idx} className="w-[140px] sm:w-[160px] flex-shrink-0 group">
                  <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img
                      src={actor.image || "https://placehold.co/185x278?text=No+Image"}
                      alt={actor.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-white font-bold text-sm mt-2 line-clamp-1">{actor.name}</h3>
                  <p className="text-gray-400 text-xs line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= REVIEWS ================= */}
      <section className="bg-[#0d0d0e] pb-24 border-t border-zinc-800/80 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
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

      {/* ================= MOVIE PLAYER MODAL ================= */}
      <MoviePlayerModal
        isOpen={playerConfig.isOpen}
        onClose={() => setPlayerConfig((prev) => ({ ...prev, isOpen: false }))}
        title={playerConfig.title}
        videoUrl={playerConfig.videoUrl}
        isTrailer={playerConfig.isTrailer}
        movie={movie}
      />
    </>
  );
};

export default MovieDetails;
