import { FaSearch, FaUndo, FaFilter } from "react-icons/fa";

const FilterBar = ({
  search,
  setSearch,
  onSearch,
  genre,
  setGenre,
  sort,
  setSort,
  genres = [],
  resetFilters,
}) => {
  return (
    <section className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 mb-12">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
          <FaFilter className="text-red-600 text-2xl" />
          <span>Explore Catalog</span>
        </h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Filter and search thousands of movies by genre, rating, and release date.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
          <input
            type="text"
            placeholder="Search movies by title, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearch();
              }
            }}
            className="w-full bg-zinc-950/90 border border-zinc-700/80 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-gray-500 outline-none focus:border-red-600 transition shadow-inner text-sm sm:text-base"
          />
        </div>

        <button
          onClick={onSearch}
          className="bg-red-600 hover:bg-red-700 transition px-8 py-4 rounded-2xl font-bold text-white whitespace-nowrap shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
        >
          <FaSearch className="text-sm" />
          <span>Search</span>
        </button>
      </div>

      {/* Filter Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Genre Selector */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-zinc-950 border border-zinc-700/80 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-red-600 transition text-sm font-medium"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id || g._id} value={g.id || g._id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Sort Selector */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-zinc-950 border border-zinc-700/80 rounded-2xl px-5 py-3.5 text-white outline-none focus:border-red-600 transition text-sm font-medium"
        >
          <option value="popularity">Sort by: Popularity</option>
          <option value="rating">Sort by: Highest Rated</option>
          <option value="newest">Sort by: Newest Release</option>
          <option value="oldest">Sort by: Oldest Release</option>
          <option value="az">Sort by: Title (A-Z)</option>
        </select>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/80 rounded-2xl text-gray-200 hover:text-white font-semibold flex items-center justify-center gap-2 transition text-sm py-3.5"
        >
          <FaUndo className="text-xs" />
          <span>Reset Filters</span>
        </button>
      </div>
    </section>
  );
};

export default FilterBar;