import { useState, useEffect, useMemo } from "react";
import {
  FaUndo,
  FaFilter,
  FaFilm,
  FaTv,
  FaGlobe,
  FaStar,
  FaSlidersH,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useGetPlatformsQuery, useGetCountriesQuery } from "../../redux/api/movies";
import { getCountryFlag, GLOBAL_COUNTRIES } from "../../utils/countryUtils";

// Built-in Brand Logo Renderers for Top Platforms
const PlatformBrandLogo = ({ name, logoPath }) => {
  const [imageError, setImageError] = useState(false);

  // If TMDB provided a valid logo path and image hasn't errored
  if (logoPath && !imageError) {
    return (
      <img
        src={`https://image.tmdb.org/t/p/w154${logoPath}`}
        alt={name}
        className="w-full h-full object-cover rounded-lg shadow-sm"
        onError={() => setImageError(true)}
      />
    );
  }

  // High Quality Branded Logomarks
  const lower = (name || "").toLowerCase();

  if (lower.includes("netflix")) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center rounded-lg border border-red-600/40">
        <span className="text-red-600 font-black text-xs sm:text-sm tracking-wider">NETFLIX</span>
      </div>
    );
  }

  if (lower.includes("disney")) {
    return (
      <div className="w-full h-full bg-[#0d1b3e] flex items-center justify-center rounded-lg border border-blue-500/40 px-1">
        <span className="text-blue-400 font-black text-xs sm:text-sm tracking-tighter">Disney<span className="text-white">+</span></span>
      </div>
    );
  }

  if (lower.includes("prime") || lower.includes("amazon")) {
    return (
      <div className="w-full h-full bg-[#00a8e1]/10 flex items-center justify-center rounded-lg border border-sky-500/40 px-1">
        <span className="text-sky-400 font-black text-[11px] sm:text-xs tracking-tight">prime<span className="text-white">video</span></span>
      </div>
    );
  }

  if (lower.includes("apple")) {
    return (
      <div className="w-full h-full bg-zinc-800 flex items-center justify-center rounded-lg border border-zinc-500/40">
        <span className="text-white font-extrabold text-xs"> tv<span className="text-gray-400">+</span></span>
      </div>
    );
  }

  if (lower.includes("max") || lower.includes("hbo")) {
    return (
      <div className="w-full h-full bg-blue-950 flex items-center justify-center rounded-lg border border-blue-600/40">
        <span className="text-blue-500 font-black text-xs sm:text-sm tracking-wider">max</span>
      </div>
    );
  }

  if (lower.includes("hulu")) {
    return (
      <div className="w-full h-full bg-[#1ce783]/10 flex items-center justify-center rounded-lg border border-emerald-500/40">
        <span className="text-[#1ce783] font-black text-xs sm:text-sm tracking-tight">hulu</span>
      </div>
    );
  }

  if (lower.includes("paramount")) {
    return (
      <div className="w-full h-full bg-blue-900/60 flex items-center justify-center rounded-lg border border-blue-400/40">
        <span className="text-blue-300 font-black text-[10px] sm:text-xs">Paramount<span className="text-white">+</span></span>
      </div>
    );
  }

  if (lower.includes("peacock")) {
    return (
      <div className="w-full h-full bg-amber-950/60 flex items-center justify-center rounded-lg border border-amber-500/40">
        <span className="text-amber-400 font-black text-xs">peacock</span>
      </div>
    );
  }

  // Generic fallback badge
  return (
    <div className="w-full h-full bg-zinc-800 flex items-center justify-center rounded-lg">
      <span className="text-xs font-bold text-gray-300 truncate px-1">
        {name.substring(0, 3)}
      </span>
    </div>
  );
};

const STATIC_TOP_PROVIDERS = [
  { provider_id: "8", provider_name: "Netflix" },
  { provider_id: "337", provider_name: "Disney+" },
  { provider_id: "9", provider_name: "Amazon Prime Video" },
  { provider_id: "350", provider_name: "Apple TV+" },
  { provider_id: "1899", provider_name: "Max" },
  { provider_id: "15", provider_name: "Hulu" },
  { provider_id: "531", provider_name: "Paramount+" },
  { provider_id: "384", provider_name: "Peacock" },
];

const FilterBar = ({
  mediaType = "movie",
  setMediaType,
  genre,
  setGenre,
  platform,
  setPlatform,
  country = "US",
  setCountry,
  year,
  setYear,
  rating,
  setRating,
  sort,
  setSort,
  genres = [],
  resetFilters,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Fetch watch providers & countries dynamically from TMDB via backend
  const { data: apiPlatforms = [] } = useGetPlatformsQuery({
    type: mediaType,
    region: country || "US",
  });

  const { data: apiCountries = [] } = useGetCountriesQuery();

  const formattedCountriesList = useMemo(() => {
    if (apiCountries && apiCountries.length > 0) {
      const list = [{ code: "", flag: "🌐", name: "🌐 All Countries / Worldwide" }];
      apiCountries.forEach((c) => {
        const code = c.iso_3166_1;
        const flag = getCountryFlag(code);
        list.push({
          code,
          flag,
          name: `${flag} ${c.english_name || code} (${code})`,
        });
      });
      return list;
    }
    return GLOBAL_COUNTRIES.map((c) => ({
      code: c.code,
      flag: getCountryFlag(c.code),
      name: `${getCountryFlag(c.code)} ${c.name}${c.code ? ` (${c.code})` : ""}`,
    }));
  }, [apiCountries]);

  const providersToDisplay =
    apiPlatforms && apiPlatforms.length > 0
      ? apiPlatforms.slice(0, 10)
      : STATIC_TOP_PROVIDERS;

  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileDrawerOpen]);

  const activeFiltersCount = [
    genre,
    platform,
    country !== "US" ? country : "",
    year,
    rating,
    sort !== "popularity" ? sort : "",
  ].filter(Boolean).length;

  return (
    <>
      <section className="w-full bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-8 mb-8 sm:mb-12 relative">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center justify-center lg:justify-start gap-2.5">
              <FaFilter className="text-red-600 text-xl sm:text-2xl" />
              <span>Explore Catalog</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Filter movies, TV series, streaming providers & origin countries.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-center">
            {/* Media Type Tabs */}
            <div className="bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800/90 flex items-center gap-1.5 flex-1 lg:flex-none justify-center">
              <button
                onClick={() => setMediaType("movie")}
                className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  mediaType === "movie"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "text-gray-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <FaFilm />
                <span>Movies</span>
              </button>
              <button
                onClick={() => setMediaType("tv")}
                className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  mediaType === "tv"
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "text-gray-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <FaTv />
                <span>TV Series</span>
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[46px]"
            >
              <FaSlidersH className="text-red-500" />
              <span className="hidden xs:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-extrabold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Streaming Platforms Row with Official Logos */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span>Streaming Platforms</span>
              <span className="text-[11px] text-red-500 font-semibold bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span>Region:</span>
                <span>{getCountryFlag(country || "US")}</span>
                <span>{country || "US"}</span>
              </span>
            </span>
            {platform && (
              <button
                onClick={() => setPlatform("")}
                className="text-xs text-red-400 hover:underline font-semibold"
              >
                Show All Platforms
              </button>
            )}
          </div>

          {/* Logo Badge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {providersToDisplay.map((p) => {
              const pId = String(p.provider_id);
              const isSelected = platform === pId;

              return (
                <button
                  key={pId}
                  onClick={() => setPlatform(isSelected ? "" : pId)}
                  className={`relative p-2.5 rounded-2xl transition-all duration-300 flex items-center gap-2.5 border ${
                    isSelected
                      ? "bg-zinc-900 border-red-600/90 ring-2 ring-red-500 shadow-xl scale-[1.02]"
                      : "bg-zinc-950/80 border-zinc-800/90 text-gray-400 hover:text-white hover:border-zinc-700"
                  }`}
                  title={p.provider_name}
                >
                  <div className="w-8 h-8 flex-shrink-0">
                    <PlatformBrandLogo
                      name={p.provider_name}
                      logoPath={p.logo_path}
                    />
                  </div>

                  <span className="text-xs font-bold text-white truncate">
                    {p.provider_name}
                  </span>

                  {isSelected && (
                    <div className="ml-auto w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold shadow flex-shrink-0">
                      <FaCheck />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Filter Options Grid */}
        <div className="hidden lg:grid grid-cols-5 gap-4 pt-5 border-t border-zinc-800/80">
          {/* Origin Country */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
              <FaGlobe className="text-red-500" />
              <span>Origin Country</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-red-600 font-medium cursor-pointer"
            >
              {formattedCountriesList.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
              <FaFilm className="text-red-500" />
              <span>Genre</span>
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-red-600 font-medium cursor-pointer"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id || g._id} value={g.id || g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Release Year */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
              <span>Release Year</span>
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-red-600 font-medium cursor-pointer"
            >
              <option value="">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2018">2018</option>
              <option value="2015">2015</option>
              <option value="2010">2010</option>
            </select>
          </div>

          {/* Min Rating */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
              <FaStar className="text-amber-400" />
              <span>Min Rating</span>
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-red-600 font-medium cursor-pointer"
            >
              <option value="">Any Rating</option>
              <option value="8">★ 8.0+ Top Rated</option>
              <option value="7">★ 7.0+ High Quality</option>
              <option value="6">★ 6.0+ Good</option>
              <option value="5">★ 5.0+ Average</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
              <span>Sort Order</span>
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-red-600 font-medium cursor-pointer"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Highest Rating</option>
              <option value="newest">Newest Release</option>
              <option value="oldest">Oldest Release</option>
            </select>
          </div>
        </div>

        {/* Active Filters Reset Banner */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
            </span>
            <button
              onClick={resetFilters}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 transition"
            >
              <FaUndo className="text-[10px]" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </section>

      {/* Mobile / Tablet Filter Drawer Sheet */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
          ></div>

          <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full flex flex-col z-10 shadow-2xl overflow-hidden animate-slide-left">
            <div className="p-5 border-b border-zinc-800/90 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <FaSlidersH className="text-red-600 text-lg" />
                <h3 className="text-white text-lg font-black tracking-tight">
                  Filter Catalog
                </h3>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-9 h-9 rounded-full bg-zinc-800 text-gray-300 flex items-center justify-center hover:bg-zinc-700 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Media Type Tabs */}
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">
                  Content Type
                </label>
                <div className="bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 flex items-center gap-2">
                  <button
                    onClick={() => setMediaType("movie")}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                      mediaType === "movie" ? "bg-red-600 text-white" : "text-gray-400"
                    }`}
                  >
                    <FaFilm />
                    <span>Movies</span>
                  </button>
                  <button
                    onClick={() => setMediaType("tv")}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                      mediaType === "tv" ? "bg-red-600 text-white" : "text-gray-400"
                    }`}
                  >
                    <FaTv />
                    <span>TV Series</span>
                  </button>
                </div>
              </div>

              {/* Streaming Platforms Grid */}
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">
                  Streaming Platforms ({country || "US"})
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {providersToDisplay.map((p) => {
                    const pId = String(p.provider_id);
                    const isSelected = platform === pId;
                    return (
                      <button
                        key={pId}
                        onClick={() => setPlatform(isSelected ? "" : pId)}
                        className={`p-2.5 rounded-xl transition flex items-center gap-2.5 border ${
                          isSelected
                            ? "bg-zinc-900 border-red-600 ring-2 ring-red-500"
                            : "bg-zinc-900/80 border-zinc-800 text-gray-400"
                        }`}
                      >
                        <div className="w-6 h-6 flex-shrink-0">
                          <PlatformBrandLogo
                            name={p.provider_name}
                            logoPath={p.logo_path}
                          />
                        </div>
                        <span className="text-xs font-bold text-white truncate">
                          {p.provider_name}
                        </span>
                        {isSelected && (
                          <div className="ml-auto w-3.5 h-3.5 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px] font-bold">
                            <FaCheck />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <FaGlobe className="text-red-500" />
                  <span>Origin Country</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none font-medium"
                >
                  {formattedCountriesList.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <FaFilm className="text-red-500" />
                  <span>Genre</span>
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none font-medium"
                >
                  <option value="">All Genres</option>
                  {genres.map((g) => (
                    <option key={g.id || g._id} value={g.id || g._id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year & Rating Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">
                    Release Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-white text-sm outline-none font-medium"
                  >
                    <option value="">All Years</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2020">2020</option>
                    <option value="2018">2018</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <FaStar className="text-amber-400" />
                    <span>Min Rating</span>
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-white text-sm outline-none font-medium"
                  >
                    <option value="">Any Rating</option>
                    <option value="8">★ 8.0+ Top</option>
                    <option value="7">★ 7.0+ High</option>
                    <option value="6">★ 6.0+ Good</option>
                  </select>
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2">
                  Sort Order
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none font-medium"
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Highest Rating</option>
                  <option value="newest">Newest Release</option>
                  <option value="oldest">Oldest Release</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-zinc-800 bg-zinc-900/80 flex items-center gap-3">
              <button
                onClick={() => {
                  resetFilters();
                  setIsMobileDrawerOpen(false);
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-gray-300 py-3 rounded-xl font-bold text-sm"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-600/30"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;