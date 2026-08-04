import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../component/Landing/Navbar";
import HeroBanner from "../../component/Landing/HeroBanner";
import MovieGrid from "./MovieGrid";
import FilterBar from "../../component/Explorer/FilterBar";
import MicroGenreFilter from "../../component/MicroGenreFilter";
import SEO from "../../component/SEO";
import { getCountryFlag } from "../../utils/countryUtils";

import {
  useDiscoverMoviesQuery,
  useGetGenresQuery,
  useGetTvGenresQuery,
} from "../../redux/api/movies";

const AllMovies = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to read filter values from URL searchParams first, then sessionStorage, then fallback
  const getInitialValue = (key, fallback) => {
    const fromUrl = searchParams.get(key);
    if (fromUrl !== null && fromUrl !== undefined) return fromUrl;

    try {
      const saved = sessionStorage.getItem("reelix_explore_filters");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[key] !== undefined && parsed[key] !== null) return String(parsed[key]);
      }
    } catch (e) {
      console.warn("Failed reading saved filters", e);
    }
    return fallback;
  };

  // ==========================
  // Filter States (Persisted)
  // ==========================

  const [mediaType, setMediaType] = useState(() => getInitialValue("type", "movie"));
  const [genre, setGenre] = useState(() => getInitialValue("genre", ""));
  const [platform, setPlatform] = useState(() => getInitialValue("platform", ""));
  const [country, setCountry] = useState(() => getInitialValue("country", "US"));
  const [year, setYear] = useState(() => getInitialValue("year", ""));
  const [rating, setRating] = useState(() => getInitialValue("rating", ""));
  const [sort, setSort] = useState(() => getInitialValue("sort", "popularity"));
  const [page, setPage] = useState(() => Number(getInitialValue("page", 1)));

  // Sync state changes into URL search parameters & sessionStorage
  useEffect(() => {
    const params = {};
    if (mediaType && mediaType !== "movie") params.type = mediaType;
    if (genre) params.genre = String(genre);
    if (platform) params.platform = String(platform);
    if (country && country !== "US") params.country = country;
    if (year) params.year = String(year);
    if (rating) params.rating = String(rating);
    if (sort && sort !== "popularity") params.sort = sort;
    if (page && page > 1) params.page = String(page);

    setSearchParams(params, { replace: true });

    try {
      sessionStorage.setItem(
        "reelix_explore_filters",
        JSON.stringify({ type: mediaType, genre, platform, country, year, rating, sort, page })
      );
    } catch (e) {
      console.warn(e);
    }
  }, [mediaType, genre, platform, country, year, rating, sort, page, setSearchParams]);

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
    region: country || "US",
    page,
  });

  const resetFilters = () => {
    setMediaType("movie");
    setGenre("");
    setPlatform("");
    setCountry("US");
    setYear("");
    setRating("");
    setSort("popularity");
    setPage(1);
    setSearchParams({}, { replace: true });
    try {
      sessionStorage.removeItem("reelix_explore_filters");
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <SEO
        title={mediaType === "tv" ? "Discover TV Series & Anime — Reelix" : "Discover Blockbuster Movies — Reelix"}
        description={`Explore thousands of ${mediaType === "tv" ? "TV series and anime" : "movies"} on Reelix. Filter by genre, streaming platform (Netflix, Disney+, Prime Video), release year, and country.`}
      />
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
            <p className="text-gray-400 text-xs sm:text-sm mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Explore thousands of {mediaType === "tv" ? "TV series" : "movies"} available on streaming providers</span>
              <span className="bg-red-950/60 border border-red-500/30 text-red-400 font-bold px-2 py-0.5 rounded-md text-xs inline-flex items-center gap-1">
                <span>Region:</span>
                <span>{getCountryFlag(country || "US")}</span>
                <span>{country || "US"}</span>
              </span>
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
            <MicroGenreFilter
              selectedTag={genre}
              onSelectTag={(tag) => {
                setGenre(tag.query ? tag.id : "");
              }}
            />
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