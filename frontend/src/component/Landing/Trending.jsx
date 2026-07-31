import MovieRow from "./MovieRow";
import CardSkeleton from "../Skeletons/CardSkeleton";
import { FaFire, FaStar, FaRocket, FaTv, FaFilm } from "react-icons/fa";
import {
  useGetTrendingMoviesQuery,
  useGetTrendingTvQuery,
  useGetTopRatedMoviesQuery,
  useGetPopularTvQuery,
  useGetNowPlayingMoviesQuery,
} from "../../redux/api/movies";

const Trending = () => {
  const { data: trendingMovies = [], isLoading: loadingTrending } = useGetTrendingMoviesQuery();
  const { data: trendingTv = [], isLoading: loadingTv } = useGetTrendingTvQuery();
  const { data: topRated = [], isLoading: loadingTopRated } = useGetTopRatedMoviesQuery();
  const { data: popularTv = [], isLoading: loadingPopularTv } = useGetPopularTvQuery();
  const { data: nowPlaying = [], isLoading: loadingNowPlaying } = useGetNowPlayingMoviesQuery();

  const isLoading = loadingTrending || loadingTv || loadingTopRated || loadingPopularTv || loadingNowPlaying;

  if (isLoading) {
    return (
      <section className="bg-black px-4 sm:px-8 py-16 flex flex-col gap-6 w-full max-w-7xl mx-auto">
        <div className="w-48 h-8 rounded-xl skeleton-shimmer mb-2"></div>
        <CardSkeleton count={7} />
      </section>
    );
  }

  return (
    <section className="bg-black px-4 sm:px-8 lg:px-12 py-12 flex flex-col gap-12 w-full max-w-7xl mx-auto">
      {/* Row 1: Trending Movies */}
      {trendingMovies.length > 0 && (
        <MovieRow
          title={
            <span className="flex items-center gap-2.5">
              <FaFire className="text-red-500 text-xl sm:text-2xl" />
              <span>Trending Movies</span>
            </span>
          }
          movies={trendingMovies.slice(0, 10)}
        />
      )}

      {/* Row 2: Trending TV Series */}
      {trendingTv.length > 0 && (
        <MovieRow
          title={
            <span className="flex items-center gap-2.5">
              <FaTv className="text-purple-400 text-xl sm:text-2xl" />
              <span>Trending TV Series & Shows</span>
            </span>
          }
          movies={trendingTv.slice(0, 10)}
        />
      )}

      {/* Row 3: Top Rated Masterpieces */}
      {topRated.length > 0 && (
        <MovieRow
          title={
            <span className="flex items-center gap-2.5">
              <FaStar className="text-amber-400 text-xl sm:text-2xl" />
              <span>Top Rated Masterpieces</span>
            </span>
          }
          movies={topRated.slice(0, 10)}
        />
      )}

      {/* Row 4: Popular TV Series */}
      {popularTv.length > 0 && (
        <MovieRow
          title={
            <span className="flex items-center gap-2.5">
              <FaRocket className="text-rose-500 text-xl sm:text-2xl" />
              <span>Popular TV Series Worldwide</span>
            </span>
          }
          movies={popularTv.slice(0, 10)}
        />
      )}

      {/* Row 5: Now Playing in Theaters */}
      {nowPlaying.length > 0 && (
        <MovieRow
          title={
            <span className="flex items-center gap-2.5">
              <FaFilm className="text-emerald-400 text-xl sm:text-2xl" />
              <span>Now Playing in Theaters</span>
            </span>
          }
          movies={nowPlaying.slice(0, 10)}
        />
      )}
    </section>
  );
};

export default Trending;