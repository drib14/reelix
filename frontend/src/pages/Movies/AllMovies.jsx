import { useState } from "react";

import Navbar from "../../component/Landing/Navbar";
import HeroBanner from "../../component/Landing/HeroBanner";
import MovieGrid from "./MovieGrid";
import FilterBar from "../../component/Explorer/FilterBar";

import {
  useDiscoverMoviesQuery,
  useGetGenresQuery,
  useGetTvGenresQuery,
} from "../../redux/api/movies";

const AllMovies = () => {
  // ==========================
  // Filter States
  // ==========================

  const [mediaType, setMediaType] = useState("movie"); // "movie" | "tv"
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [country, setCountry] = useState("US"); // Default region: US 🇺🇸
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("popularity");
  const [page, setPage] = useState(1);

  // ==========================
  // Fetch Genres
  // ==========================

  const { data: movieGenres = [] } = useGetGenresQuery();
  const { data: tvGenres = [] } = useGetTvGenresQuery();

  const currentGenres = mediaType === "tv" ? tvGenres : movieGenres;

  // ==========================
  // Discover Media
  // ==========================

  const {
    data: discoverMedia = [],
    isLoading: discoverLoading,
  } = useDiscoverMoviesQuery({
    type: mediaType,
    genre,
    platform,
    country,
    year,
    rating,
    sort,
    region: "US",
    page,
  });

  const resetFilters = () => {
    setGenre("");
    setPlatform("");
    setCountry("US");
    setYear("");
    setRating("");
    setSort("popularity");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <Navbar />

      <HeroBanner movie={discoverMedia[0]} />

      {/* Full Screen Width Occupancy for Large Screens */}
      <div className="relative z-20 -mt-20 w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-16">
        <FilterBar
          mediaType={mediaType}
          setMediaType={(type) => {
            setMediaType(type);
            setGenre(""); // reset genre on media type swap
          }}
          genre={genre}
          setGenre={setGenre}
          platform={platform}
          setPlatform={setPlatform}
          country={country}
          setCountry={setCountry}
          year={year}
          setYear={setYear}
          rating={rating}
          setRating={setRating}
          sort={sort}
          setSort={setSort}
          genres={currentGenres}
          resetFilters={resetFilters}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              {mediaType === "tv" ? "Discover TV Shows & Series" : "Discover Movies"}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Explore thousands of {mediaType === "tv" ? "TV series" : "movies"} available on streaming providers (Region: {country || "US"}).
            </p>
          </div>

          {!discoverLoading && (
            <div className="text-xs sm:text-sm text-gray-300 font-semibold bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl backdrop-blur-md">
              {discoverMedia.length} Title{discoverMedia.length !== 1 ? "s" : ""} Found
            </div>
          )}
        </div>

        {discoverLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : discoverMedia.length === 0 ? (
          <div className="text-center py-24 bg-zinc-900/40 rounded-3xl border border-zinc-800">
            <h2 className="text-2xl sm:text-3xl font-bold">No Titles Found</h2>
            <p className="text-gray-400 mt-2 text-sm">
              Try changing or resetting some of your filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 font-bold text-sm rounded-xl transition shadow-lg shadow-red-600/30"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <MovieGrid movies={discoverMedia} isLoading={false} />

            <div className="flex justify-center mt-12">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-8 py-3.5 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-sm transition duration-300 shadow-lg shadow-red-600/30"
              >
                Load More Titles
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllMovies;