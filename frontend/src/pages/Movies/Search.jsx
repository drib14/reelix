import { Link, useParams } from "react-router-dom";
import { useSearchMoviesQuery } from "../../redux/api/movies";

const Search = () => {
  const { keyword } = useParams();

  const {
    data: movies,
    isLoading,
    error,
  } = useSearchMoviesQuery(keyword);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <h1 className="text-white text-3xl font-bold">
          Searching...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <h1 className="text-red-500 text-3xl font-bold">
          Something went wrong.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-10">

      <h1 className="text-4xl font-bold mb-10">
        Search Results for "{keyword}"
      </h1>

      {movies?.length === 0 ? (
        <h2 className="text-gray-400 text-xl">
          No movies found.
        </h2>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">

          {movies?.map((movie) => (
            <Link
              key={movie._id}
              to={`/movies/${movie._id}`}
              className="group"
            >
              <img
                src={movie.poster}
                alt={movie.name}
                className="rounded-xl hover:scale-105 transition duration-300"
              />

              <h2 className="mt-3 font-semibold group-hover:text-red-500">
                {movie.name}
              </h2>

              <p className="text-gray-400">
                {movie.year}
              </p>
            </Link>
          ))}

        </div>
      )}

    </div>
  );
};

export default Search;