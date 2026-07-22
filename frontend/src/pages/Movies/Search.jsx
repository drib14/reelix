import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaFilm, FaFire, FaCompass, FaArrowLeft } from "react-icons/fa";

import Navbar from "../../component/Landing/Navbar";
import MovieCard from "./MovieCard";
import MovieGrid from "./MovieGrid";
import Footer from "../../component/Landing/Footer";

import {
  useSearchMoviesQuery,
  useGetTrendingMoviesQuery,
} from "../../redux/api/movies";

const POPULAR_SEARCH_TAGS = [
  "Action",
  "Sci-Fi",
  "Marvel",
  "Batman",
  "Comedy",
  "Horror",
  "Drama",
  "Anime",
  "Thriller",
  "Adventure",
];

const Search = () => {
  const { keyword: urlKeyword } = useParams();
  const navigate = useNavigate();

  const [inputQuery, setInputQuery] = useState(urlKeyword || "");
  const activeKeyword = urlKeyword || "";

  // Update input when URL param changes
  useEffect(() => {
    setInputQuery(urlKeyword || "");
  }, [urlKeyword]);

  const {
    data: movies = [],
    isLoading,
    isFetching,
    error,
  } = useSearchMoviesQuery(activeKeyword, {
    skip: !activeKeyword.trim(),
  });

  const { data: trendingMovies = [] } = useGetTrendingMoviesQuery();

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (inputQuery.trim()) {
      navigate(`/search/${encodeURIComponent(inputQuery.trim())}`);
    }
  };

  const handleTagClick = (tag) => {
    setInputQuery(tag);
    navigate(`/search/${encodeURIComponent(tag)}`);
  };

  const clearSearch = () => {
    setInputQuery("");
    navigate("/movies");
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      {/* Main Netflix Navigation */}
      <Navbar />

      {/* Hero Search Section */}
      <div className="pt-28 pb-10 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Back Link */}
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition mb-6 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-xl backdrop-blur-md"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to Catalog</span>
        </Link>

        {/* Big Search Header Box */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                <FaSearch className="text-red-600 text-2xl sm:text-4xl" />
                <span>Search Movies</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mt-2 leading-relaxed">
                Explore titles, actors, directors, or genres across our high-definition catalog.
              </p>
            </div>

            {/* Total Results Counter Badge */}
            {activeKeyword && !isLoading && (
              <div className="bg-red-950/40 border border-red-500/30 px-5 py-3 rounded-2xl flex items-center gap-3">
                <FaFilm className="text-red-500" />
                <div>
                  <p className="text-xs text-red-300 font-medium">Found</p>
                  <p className="text-lg font-bold text-white">
                    {movies?.length || 0} {movies?.length === 1 ? "Movie" : "Movies"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="mt-8 relative w-full">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-5 text-gray-400 text-lg pointer-events-none" />
              <input
                type="text"
                placeholder="Search movies by title, genre, actor..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full bg-zinc-950/90 border-2 border-zinc-700/80 focus:border-red-600 text-white text-base sm:text-lg pl-14 pr-32 py-4 rounded-2xl outline-none transition-all shadow-inner placeholder-gray-500"
              />
              
              <div className="absolute right-3 flex items-center gap-2">
                {inputQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-2 text-gray-400 hover:text-white transition rounded-xl"
                    title="Clear search"
                  >
                    <FaTimes />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition shadow-lg shadow-red-600/30"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Popular Search Suggestion Tags */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <FaFire className="text-red-500 text-xs" /> Popular Searches:
            </span>
            {POPULAR_SEARCH_TAGS.map((tag) => {
              const isSelected = activeKeyword.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition duration-200 ${
                    isSelected
                      ? "bg-red-600 border-red-500 text-white shadow-md"
                      : "bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700/80 text-gray-300 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 w-full pb-20">
        {/* Active Query Headline */}
        {activeKeyword && (
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Results for</span>
              <span className="text-red-500">"{activeKeyword}"</span>
            </h2>
            <button
              onClick={clearSearch}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* 1. Loading State */}
        {isLoading || isFetching ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm font-medium mt-4">Searching movies...</p>
          </div>
        ) : error ? (
          /* 2. Error State */
          <div className="py-16 text-center bg-zinc-900/50 border border-red-500/30 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-red-500">Unable to load search results</h3>
            <p className="text-gray-400 text-sm mt-2">Please check your network connection or try again.</p>
          </div>
        ) : movies && movies.length > 0 ? (
          /* 3. Found Results Grid */
          <MovieGrid movies={movies} isLoading={false} />
        ) : (
          /* 4. Netflix Style Empty Search State */
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 text-2xl mb-4 shadow-xl">
              <FaCompass />
            </div>
            <h3 className="text-white text-2xl font-bold">
              {activeKeyword ? `No movies found for "${activeKeyword}"` : "Search for your favorite movies"}
            </h3>
            <p className="text-gray-400 text-sm max-w-md mt-2">
              Try searching with different keywords, genres, or check out our trending titles below.
            </p>

            {/* Suggested Trending Movies Grid */}
            {trendingMovies?.length > 0 && (
              <div className="w-full mt-14 text-left border-t border-zinc-800/80 pt-10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaFire className="text-red-500" />
                  <span>Trending Movies You Might Like</span>
                </h3>
                <MovieGrid movies={trendingMovies.slice(0, 6)} isLoading={false} />
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;