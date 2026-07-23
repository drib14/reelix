import { FaFilm } from "react-icons/fa";
import MovieCard from "./MovieCard";
import CardSkeleton from "../../component/Skeletons/CardSkeleton";

const MovieGrid = ({ movies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="py-6">
        <CardSkeleton count={14} />
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 text-2xl mb-4 shadow-xl">
          <FaFilm />
        </div>
        <h3 className="text-white text-xl font-bold">No titles found</h3>
        <p className="text-gray-400 text-sm mt-1">
          Try broadening your filter criteria or resetting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie._id || movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;