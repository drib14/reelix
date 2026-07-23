import MovieRow from "./MovieRow";
import CardSkeleton from "../Skeletons/CardSkeleton";
import { FaFire, FaStar, FaRocket } from "react-icons/fa";
import {
  useGetTrendingMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetPopularMoviesQuery,
} from "../../redux/api/movies";

const Trending = () => {
  const { data: trending = [], isLoading: loadingTrending } = useGetTrendingMoviesQuery();
  const { data: topRated = [], isLoading: loadingTopRated } = useGetTopRatedMoviesQuery();
  const { data: popular = [], isLoading: loadingPopular } = useGetPopularMoviesQuery();

  const isLoading = loadingTrending || loadingTopRated || loadingPopular;

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
      {/* Row 1: Top 10 Trending */}
      {trending.length > 0 && (
        <MovieRow
          title={
            <span className="flex items-center gap-2.5">
              <FaFire className="text-red-500 text-xl sm:text-2xl" />
              <span>Trending Right Now</span>
            </span>
          }
          movies={trending.slice(0, 10)}
        />
      )}

      {/* Row 2: Top Rated Masterpieces */}
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

      {/* Row 3: Popular Blockbusters */}
      {popular.length > 0 && (
        <MovieRow
          title={
            <span className="flex items-center gap-2.5">
              <FaRocket className="text-purple-500 text-xl sm:text-2xl" />
              <span>Popular Worldwide</span>
            </span>
          }
          movies={popular.slice(0, 10)}
        />
      )}
    </section>
  );
};

export default Trending;