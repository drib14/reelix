import { FaSearch, FaUndo } from "react-icons/fa";

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
    <section className="bg-[#141414]/95 backdrop-blur-xl border border-zinc-700 rounded-3xl shadow-2xl p-8 mb-12">

      {/* Heading */}

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-white">
          Discover Movies
        </h2>

        <p className="text-gray-400 mt-3 text-lg">
          Search, filter and explore thousands of movies.
        </p>
      </div>

      {/* Search */}

      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <div className="relative flex-1">

          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearch();
              }
            }}
            className="w-full bg-[#1f1f1f] border border-zinc-700 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-gray-500 outline-none focus:border-red-500 transition"
          />

        </div>

        <button
          onClick={onSearch}
          className="bg-red-600 hover:bg-red-700 transition px-10 py-4 rounded-2xl font-semibold text-white whitespace-nowrap"
        >
          Search
        </button>

      </div>

      {/* Filters */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Genre */}

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="bg-[#1f1f1f] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-500 transition"
        >
          <option value="">🎭 All Genres</option>

          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Sort */}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-[#1f1f1f] border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-500 transition"
        >
          <option value="popularity">🔥 Popularity</option>
          <option value="rating">⭐ Highest Rated</option>
          <option value="newest">📅 Newest</option>
          <option value="oldest">📽 Oldest</option>
          <option value="az">🔤 A-Z</option>
        </select>

        {/* Reset */}

        <button
          onClick={resetFilters}
          className="bg-red-600 hover:bg-red-700 rounded-2xl text-white font-semibold flex items-center justify-center gap-3 transition"
        >
          <FaUndo />
          Reset Filters
        </button>

      </div>

    </section>
  );
};

export default FilterBar;