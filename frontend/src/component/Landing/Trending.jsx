import MovieRow from "./MovieRow";
import { useGetRandomMoviesQuery } from "../../redux/api/movies";

const Trending = () => {
  const {
    data: trending,
    isLoading,
    error,
  } = useGetRandomMoviesQuery();

  if (isLoading) {
    return (
      <section className="bg-black text-white px-10 md:px-16 py-14">
        <h2 className="text-4xl font-bold">
          Loading Movies...
        </h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-black text-white px-10 md:px-16 py-14">
        <h2 className="text-4xl font-bold text-red-500">
          Unable to load movies.
        </h2>
      </section>
    );
  }

  return (
    <section className="bg-black px-10 md:px-16 py-14">
      <MovieRow
        title="🔥 Trending Now"
        movies={trending}
      />
    </section>
  );
};

export default Trending;