import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <h2 className="text-white text-2xl animate-pulse">
          Loading Movies...
        </h2>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex justify-center items-center py-24">
        <h2 className="text-gray-400 text-2xl">
          No movies found.
        </h2>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">

        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
          />
        ))}

      </div>

    </section>
  );
};

export default MovieGrid;