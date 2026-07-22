import { FaFilm } from "react-icons/fa";
import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 py-8">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800"
          ></div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 text-2xl mb-4 shadow-xl">
          <FaFilm />
        </div>
        <h3 className="text-white text-xl font-bold">No movies found</h3>
        <p className="text-gray-400 text-sm mt-1">
          Try broadening your search keywords or resetting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie._id || movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;