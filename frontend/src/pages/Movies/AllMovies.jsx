import { useState } from "react";

import Navbar from "../../component/Landing/Navbar";
import HeroBanner from "../../component/Landing/HeroBanner";
import MovieGrid from "./MovieGrid";
import FilterBar from "../../component/Explorer/FilterBar";

import {
  useDiscoverMoviesQuery,
  useGetGenresQuery,
  useSearchMoviesQuery,
} from "../../redux/api/movies";

const AllMovies = () => {
  // ==========================
  // Filter States
  // ==========================

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("popularity");

  const [page, setPage] = useState(1);

  // ==========================
  // Fetch Genres
  // ==========================

  const {
    data: genres = [],
    isLoading: genresLoading,
  } = useGetGenresQuery();

  // ==========================
  // Fetch Movies
  // ==========================

// ==========================
// Discover Movies
// ==========================

const {
  data: discoverMovies = [],
  isLoading: discoverLoading,
} = useDiscoverMoviesQuery({
  genre,
  sort,
  page,
});

// ==========================
// Search Movies
// ==========================

const {
  data: searchedMovies = [],
  isLoading: searchLoading,
} = useSearchMoviesQuery(search, {
  skip: search.trim() === "",
});

  // ==========================
  // Search
  // ==========================

// ==========================
// Display Movies
// ==========================

const filteredMovies =
  search.trim() !== ""
    ? searchedMovies
    : discoverMovies;

const isLoading =
  search.trim() !== ""
    ? searchLoading
    : discoverLoading;

  // ==========================
  // Search Button
  // ==========================

  const handleSearch = () => {
    setSearch(searchInput);
  };

  // ==========================
  // Reset
  // ==========================

  const resetFilters = () => {
    setSearch("");
    setSearchInput("");
    setGenre("");
    setSort("popularity");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <HeroBanner movie={filteredMovies[0]} />

      <div className="relative z-20 -mt-20 max-w-7xl mx-auto px-6 pb-12">

        <FilterBar
          search={searchInput}
          setSearch={setSearchInput}
          onSearch={handleSearch}
          genre={genre}
          setGenre={setGenre}
          sort={sort}
          setSort={setSort}
          genres={genres}
          resetFilters={resetFilters}
        />

        <div className="flex items-center justify-between mt-12 mb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Discover Movies
            </h2>

            <p className="text-gray-400 mt-3">
              Explore the latest movies using smart filters.
            </p>
          </div>

          {!isLoading && (
            <div className="hidden md:block text-gray-400">
              {filteredMovies.length} Movies Found
            </div>
          )}
        </div>

        {isLoading || genresLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-4xl font-bold">
              No Movies Found
            </h2>

            <p className="text-gray-400 mt-4">
              Try changing the search or genre.
            </p>
          </div>
        ) : (
          <>
            <MovieGrid
              movies={filteredMovies}
              isLoading={false}
            />

            <div className="flex justify-center mt-14">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition duration-300"
              >
                Load More Movies
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllMovies;