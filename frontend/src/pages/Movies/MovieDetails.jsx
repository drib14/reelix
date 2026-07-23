import { useState, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaPlay,
  FaStar,
  FaFilm,
  FaHeart,
  FaCheck,
  FaArrowLeft,
  FaTv,
  FaSearch,
  FaListOl,
} from "react-icons/fa";
import { getCountryFlag } from "../../utils/countryUtils";

import {
  useGetSpecificMovieQuery,
  useGetTvDetailsQuery,
  useGetTvSeasonDetailsQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";

import MovieTabs from "./MovieTabs";
import MoviePlayerModal from "../../component/MoviePlayerModal";
import SEO from "../../component/SEO";

import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../redux/features/watchlist/watchlistSlice";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [searchParams] = useSearchParams();
  const isTvType = searchParams.get("type") === "tv";

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Season & Episode States for TV / Anime Series
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodeRange, setEpisodeRange] = useState("all"); // "all" | "1-25" | "26-50" | etc
  const [episodeSearch, setEpisodeSearch] = useState("");

  const [playerConfig, setPlayerConfig] = useState({
    isOpen: false,
    title: "",
    videoUrl: "",
    isTrailer: false,
    season: 1,
    episode: 1,
  });

  const { data: movieData, refetch: refetchMovie } = useGetSpecificMovieQuery(movieId, { skip: isTvType });
  const { data: tvData, refetch: refetchTv } = useGetTvDetailsQuery(movieId, { skip: !isTvType });

  const movie = isTvType ? tvData : movieData;
  const refetch = isTvType ? refetchTv : refetchMovie;
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.movies);

  const isInWatchlist = watchlist.some((item) => item._id === movie?._id);

  const watchlistHandler = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie._id));
      toast.success("Removed from Watchlist");
    } else {
      dispatch(addToWatchlist(movie));
      toast.success("Added to Watchlist");
    }
  };

  const [createReview, { isLoading: loadingMovieReview }] = useAddMovieReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        id: movieId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  // Determine number of seasons & fetch real TMDB season details
  const isSeries = movie?.media_type === "tv" || isTvType || !!movie?.numberOfSeasons;

  const { data: seasonDetailsData, isLoading: loadingSeasonDetails } = useGetTvSeasonDetailsQuery(
    { id: movieId, season: selectedSeason },
    { skip: !isSeries || !movieId }
  );

  const availableSeasons = useMemo(() => {
    if (movie?.seasons && movie.seasons.length > 0) {
      const validSeasons = movie.seasons.filter((s) => s.season_number > 0);
      if (validSeasons.length > 0) {
        return validSeasons.map((s) => {
          const sName = s.name || "";
          const hasCustomName = sName && !sName.toLowerCase().startsWith("season ") && sName !== `Season ${s.season_number}`;
          return {
            seasonNumber: s.season_number,
            name: sName,
            displayName: hasCustomName ? `Season ${s.season_number}: ${sName}` : (sName || `Season ${s.season_number}`),
            episodeCount: s.episode_count || 24,
          };
        });
      }
    }
    const count = movie?.numberOfSeasons || 1;
    return Array.from({ length: count }, (_, i) => ({
      seasonNumber: i + 1,
      displayName: `Season ${i + 1}`,
      episodeCount: 24,
    }));
  }, [movie]);

  const totalSeasonsCount = availableSeasons.length;

  const currentSeasonData = useMemo(() => {
    return availableSeasons.find((s) => s.seasonNumber === selectedSeason) || availableSeasons[0];
  }, [availableSeasons, selectedSeason]);

  const totalEpisodesInSeason = seasonDetailsData?.episodes?.length || currentSeasonData?.episodeCount || 24;

  const generatedEpisodesList = useMemo(() => {
    const list = [];
    for (let ep = 1; ep <= totalEpisodesInSeason; ep++) {
      list.push({
        episodeNumber: ep,
        title: `Episode ${ep}`,
        overview: `Episode ${ep} of Season ${selectedSeason}. Stream in 1080p Ultra HD across all available servers.`,
        still: "",
        runtime: 24,
      });
    }
    return list;
  }, [totalEpisodesInSeason, selectedSeason]);

  const activeEpisodesList = useMemo(() => {
    if (seasonDetailsData?.episodes && seasonDetailsData.episodes.length > 0) {
      return seasonDetailsData.episodes.map((ep) => ({
        episodeNumber: ep.episodeNumber,
        title: ep.title ? `EP ${ep.episodeNumber}: ${ep.title}` : `Episode ${ep.episodeNumber}`,
        rawTitle: ep.title || `Episode ${ep.episodeNumber}`,
        overview: ep.overview || `Episode ${ep.episodeNumber} of Season ${selectedSeason}.`,
        still: ep.still || "",
        runtime: ep.runtime || 24,
      }));
    }
    return generatedEpisodesList;
  }, [seasonDetailsData, generatedEpisodesList, selectedSeason]);

  // Episode Filtration (by Range Chunks & Quick Search)
  const filteredEpisodesList = useMemo(() => {
    return activeEpisodesList.filter((ep) => {
      // Search filter
      if (episodeSearch.trim()) {
        const epNumStr = String(ep.episodeNumber);
        const searchStr = episodeSearch.trim().toLowerCase();
        const titleStr = ep.title.toLowerCase();
        if (!epNumStr.includes(searchStr) && !titleStr.includes(searchStr)) return false;
      }

      // Range Chunk filter
      if (episodeRange === "all") return true;
      const [startStr, endStr] = episodeRange.split("-");
      const start = parseInt(startStr);
      const end = endStr ? parseInt(endStr) : 9999;
      return ep.episodeNumber >= start && ep.episodeNumber <= end;
    });
  }, [activeEpisodesList, episodeRange, episodeSearch]);

  // Generate Episode Range Chunks (e.g. 1-25, 26-50, 51-75)
  const rangeChunks = useMemo(() => {
    if (totalEpisodesInSeason <= 20) return [];
    const chunks = [{ label: "All", value: "all" }];
    const step = 25;
    for (let start = 1; start <= totalEpisodesInSeason; start += step) {
      const end = Math.min(start + step - 1, totalEpisodesInSeason);
      chunks.push({
        label: `${start} - ${end}`,
        value: `${start}-${end}`,
      });
    }
    return chunks;
  }, [totalEpisodesInSeason]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const defaultVideoStream = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

  const playEpisodeHandler = (seasonNum, epNum) => {
    setSelectedSeason(seasonNum);
    setSelectedEpisode(epNum);
    setPlayerConfig({
      isOpen: true,
      title: `${movie.name} - Season ${seasonNum} Episode ${epNum}`,
      videoUrl: movie.videoUrl || defaultVideoStream,
      isTrailer: false,
      season: seasonNum,
      episode: epNum,
    });
  };

  const originCountry = movie.originCountry || (movie.origin_country && movie.origin_country[0]) || "";

  return (
    <>
      <SEO
        title={`${movie.name}${movie.year ? ` (${movie.year})` : ""} — Watch HD on Reelix`}
        description={movie.overview ? movie.overview.substring(0, 160) : `Stream ${movie.name} in 1080p Ultra HD across 8 global servers on Reelix.`}
        image={movie.backdrop || movie.poster}
      />

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen w-full overflow-hidden pt-20">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.name}
          className="absolute inset-0 w-full h-full object-cover scale-105 filter blur-sm opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-[#0d0d0e]/80 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0e] via-[#0d0d0e]/70 to-transparent"></div>

        {/* Back Navigation */}
        <div className="absolute top-24 left-6 sm:left-12 z-30">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 transition-all duration-300 px-5 py-2.5 rounded-xl font-medium text-white text-sm backdrop-blur-md shadow-lg"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Catalog</span>
          </Link>
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-20 max-w-7xl mx-auto min-h-[85vh] flex items-center px-4 sm:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14 w-full">
            {/* Poster Card */}
            <div className="flex-shrink-0 w-[240px] sm:w-[300px] lg:w-[340px] rounded-2xl overflow-hidden border border-zinc-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-zinc-900">
              <img
                src={movie.poster}
                alt={movie.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Movie / Series Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {movie.name}
              </h1>

              {/* Meta Stats Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4 text-sm sm:text-base text-gray-300 font-medium">
                {movie.rating && (
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-md font-bold flex items-center gap-1">
                    <FaStar className="text-xs" />
                    <span>{movie.rating?.toFixed(1)}</span>
                  </span>
                )}

                <span className={`uppercase text-xs px-2.5 py-1 rounded-md font-extrabold border ${
                  isSeries
                    ? "bg-purple-600/30 text-purple-300 border-purple-500/40"
                    : "bg-blue-600/30 text-blue-300 border-blue-500/40"
                }`}>
                  {isSeries ? "TV Series / Anime" : "Movie"}
                </span>

                {movie.year && <span>• {movie.year}</span>}
                {isSeries && totalSeasonsCount > 0 && (
                  <span>• {totalSeasonsCount} Season{totalSeasonsCount > 1 ? "s" : ""}</span>
                )}
                {movie.runtime && <span>• {movie.runtime} min</span>}
                {movie.language && (
                  <span className="uppercase text-xs bg-zinc-800 px-2.5 py-1 rounded-md text-gray-300 border border-zinc-700 flex items-center gap-1">
                    {originCountry && <span>{getCountryFlag(originCountry)}</span>}
                    <span>{movie.language}</span>
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-6">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id || genre._id}
                    className="bg-red-950/60 border border-red-500/30 px-3.5 py-1.5 rounded-full text-red-400 text-xs font-semibold"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Streaming Play Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8">
                <button
                  onClick={() => playEpisodeHandler(selectedSeason, selectedEpisode)}
                  className="bg-red-600 hover:bg-red-700 transition duration-300 rounded-xl px-8 py-4 text-white text-base sm:text-lg font-bold shadow-xl shadow-red-600/30 flex items-center gap-2.5 group transform hover:scale-105"
                >
                  <FaPlay className="text-sm pl-0.5" />
                  <span>{isSeries ? `Stream S${selectedSeason}:E${selectedEpisode}` : "Play Full Movie"}</span>
                </button>

                {movie.trailer && (
                  <button
                    onClick={() => {
                      setPlayerConfig({
                        isOpen: true,
                        title: `${movie.name} (Trailer)`,
                        videoUrl: movie.trailer,
                        isTrailer: true,
                        season: 1,
                        episode: 1,
                      });
                    }}
                    className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 transition duration-300 rounded-xl px-6 py-4 text-white text-base sm:text-lg font-bold flex items-center gap-2 transform hover:scale-105"
                  >
                    <FaFilm className="text-red-500 text-base" />
                    <span>Trailer</span>
                  </button>
                )}

                <button
                  onClick={watchlistHandler}
                  className={`px-6 py-4 rounded-xl text-base sm:text-lg font-bold transition duration-300 border flex items-center gap-2 transform hover:scale-105 ${
                    isInWatchlist
                      ? "bg-zinc-800/80 border-zinc-700 text-gray-300 hover:bg-zinc-700"
                      : "bg-white text-black border-white hover:bg-gray-200"
                  }`}
                >
                  {isInWatchlist ? (
                    <>
                      <FaCheck className="text-sm text-emerald-500" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <FaHeart className="text-sm text-red-600" />
                      <span>Watchlist</span>
                    </>
                  )}
                </button>
              </div>

              {/* Overview */}
              <div className="mt-8 text-left max-w-3xl">
                <h3 className="text-white text-lg font-bold mb-2">Overview</h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 text-left">
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Type</p>
                  <p className="text-white font-bold text-sm mt-1 uppercase">
                    {isSeries ? "TV / Anime Series" : "Feature Film"}
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Country / Lang</p>
                  <p className="text-white font-bold text-sm mt-1 uppercase flex items-center gap-1.5">
                    {originCountry && <span>{getCountryFlag(originCountry)}</span>}
                    <span>{originCountry || movie.language || "EN"}</span>
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Release Date</p>
                  <p className="text-white font-bold text-sm mt-1 truncate">
                    {movie.releaseDate || movie.year || "N/A"}
                  </p>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-xs font-medium">Servers</p>
                  <p className="text-emerald-400 font-bold text-sm mt-1">
                    8 HD Global Servers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ANIME & TV SERIES EPISODE EXPLORER ================= */}
      {isSeries && (
        <section className="bg-[#0d0d0e] py-12 border-t border-zinc-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-white text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
                  <FaTv className="text-red-600" />
                  <span>Episodes & Seasons</span>
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Select a season and episode to start streaming in HD across 6 servers.
                </p>
              </div>

              {/* Season Selector Tabs / Dropdown */}
              <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
                <span className="text-xs font-bold text-gray-400 pl-3">Season:</span>
                <select
                  value={selectedSeason}
                  onChange={(e) => {
                    setSelectedSeason(Number(e.target.value));
                    setSelectedEpisode(1);
                  }}
                  className="bg-zinc-900 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl outline-none border border-zinc-700 cursor-pointer max-w-xs sm:max-w-md truncate"
                >
                  {availableSeasons.map((s) => (
                    <option key={s.seasonNumber} value={s.seasonNumber}>
                      {s.displayName} ({s.episodeCount} Episodes)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Episode Range Chunks & Jump Search (For Long Series & Anime) */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Range Chunks */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
                <span className="text-xs text-gray-400 font-bold whitespace-nowrap flex items-center gap-1 mr-1">
                  <FaListOl className="text-red-500" />
                  <span>Filter Range:</span>
                </span>
                {rangeChunks.length > 0 ? (
                  rangeChunks.map((chunk) => (
                    <button
                      key={chunk.value}
                      onClick={() => setEpisodeRange(chunk.value)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                        episodeRange === chunk.value
                          ? "bg-red-600 text-white border-red-500 shadow-md"
                          : "bg-zinc-950 text-gray-400 border-zinc-800 hover:text-white"
                      }`}
                    >
                      {chunk.label}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">All {totalEpisodesInSeason} Episodes</span>
                )}
              </div>

              {/* Episode Jump Search Input */}
              <div className="relative w-full sm:w-48">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                <input
                  type="text"
                  placeholder="Search Ep title / #..."
                  value={episodeSearch}
                  onChange={(e) => setEpisodeSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 outline-none focus:border-red-600"
                />
              </div>
            </div>

            {/* Episode Grid Cards */}
            {loadingSeasonDetails ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-xs text-gray-400">Loading {currentSeasonData?.displayName || `Season ${selectedSeason}`} episodes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEpisodesList.map((ep) => {
                  const isCurrentPlaying = playerConfig.isOpen && playerConfig.season === selectedSeason && playerConfig.episode === ep.episodeNumber;

                  // Check stored watch progress
                  const storageKey = `reelix_progress_${movie._id || movie.id}_s${selectedSeason}_e${ep.episodeNumber}`;
                  const savedProgressRaw = localStorage.getItem(storageKey);
                  const savedProgress = savedProgressRaw ? JSON.parse(savedProgressRaw) : null;

                  return (
                    <div
                      key={ep.episodeNumber}
                      onClick={() => playEpisodeHandler(selectedSeason, ep.episodeNumber)}
                      className={`group relative rounded-2xl overflow-hidden bg-zinc-900 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isCurrentPlaying
                          ? "border-red-600 ring-2 ring-red-600 bg-red-950/20 shadow-xl"
                          : "border-zinc-800 hover:border-zinc-700 hover:-translate-y-1"
                      }`}
                    >
                      {/* Optional Episode Still Thumbnail */}
                      {ep.still ? (
                        <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                          <img
                            src={ep.still}
                            alt={ep.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/60"></div>
                          <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                            <span className="bg-red-600/90 backdrop-blur-md text-white font-black text-[11px] px-2 py-0.5 rounded-md shadow">
                              EP {ep.episodeNumber}
                            </span>
                            {isCurrentPlaying ? (
                              <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-md animate-pulse flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                                <span>PLAYING</span>
                              </span>
                            ) : savedProgress?.percent >= 90 ? (
                              <span className="text-[10px] bg-emerald-600/90 text-white font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                <FaCheck className="text-[9px]" />
                                <span>WATCHED</span>
                              </span>
                            ) : null}
                          </div>
                          <div className="absolute bottom-2 left-2 text-[10px] font-bold text-gray-300 bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
                            {ep.runtime} min
                          </div>
                        </div>
                      ) : null}

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          {!ep.still && (
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg">
                                EP {ep.episodeNumber}
                              </span>
                              {isCurrentPlaying ? (
                                <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-md animate-pulse flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                                  <span>NOW PLAYING</span>
                                </span>
                              ) : savedProgress?.percent >= 90 ? (
                                <span className="text-[10px] bg-emerald-600/90 text-white font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <FaCheck className="text-[9px]" />
                                  <span>WATCHED</span>
                                </span>
                              ) : null}
                            </div>
                          )}

                          <h3 className="text-white font-bold text-sm line-clamp-1 group-hover:text-red-400 transition">
                            {ep.title}
                          </h3>
                          <p className="text-gray-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                            {ep.overview}
                          </p>
                        </div>

                        {/* Bottom Play Action & Progress Line */}
                        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                          <span className="text-[11px] text-gray-500 font-medium">1080p HD</span>
                          <button className="bg-zinc-800 group-hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition">
                            <FaPlay className="text-[9px]" />
                            <span>Watch</span>
                          </button>
                        </div>
                      </div>

                      {/* Bottom Progress Line */}
                      {savedProgress && savedProgress.percent < 90 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                          <div
                            style={{ width: `${savedProgress.percent}%` }}
                            className="h-full bg-red-600"
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= CAST ================= */}
      {movie.cast?.length > 0 && (
        <section className="bg-[#0d0d0e] py-12 border-t border-zinc-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <h2 className="text-white text-2xl sm:text-3xl font-extrabold mb-6">Top Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {movie.cast.map((actor, idx) => (
                <div key={actor.id || idx} className="w-[140px] sm:w-[160px] flex-shrink-0 group">
                  <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img
                      src={actor.image || "https://placehold.co/185x278?text=No+Image"}
                      alt={actor.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-white font-bold text-sm mt-2 line-clamp-1">{actor.name}</h3>
                  <p className="text-gray-400 text-xs line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= REVIEWS ================= */}
      <section className="bg-[#0d0d0e] pb-24 border-t border-zinc-800/80 pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <MovieTabs
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>
      </section>

      {/* ================= FLOATING STICKY MOBILE PLAY BAR ================= */}
      {isSeries ? (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-zinc-950/95 border border-red-600/60 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex items-center justify-between animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 overflow-hidden flex-shrink-0 border border-zinc-700">
              <img src={movie.poster} alt={movie.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-white font-extrabold text-xs truncate">{movie.name}</h4>
              <p className="text-gray-400 text-[11px] truncate">
                {currentSeasonData?.displayName || `Season ${selectedSeason}`} • EP {selectedEpisode}
              </p>
            </div>
          </div>
          <button
            onClick={() => playEpisodeHandler(selectedSeason, selectedEpisode)}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/40 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <FaPlay className="text-[10px]" />
            <span>Stream S{selectedSeason}:E{selectedEpisode}</span>
          </button>
        </div>
      ) : (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-zinc-950/95 border border-red-600/60 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex items-center justify-between animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 overflow-hidden flex-shrink-0 border border-zinc-700">
              <img src={movie.poster} alt={movie.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-white font-extrabold text-xs truncate">{movie.name}</h4>
              <p className="text-gray-400 text-[11px] truncate">Full Movie • 1080p HD</p>
            </div>
          </div>
          <button
            onClick={() => playEpisodeHandler(1, 1)}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/40 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <FaPlay className="text-[10px]" />
            <span>Play Movie</span>
          </button>
        </div>
      )}

      {/* ================= MOVIE & TV PLAYER MODAL ================= */}
      <MoviePlayerModal
        isOpen={playerConfig.isOpen}
        onClose={() => setPlayerConfig((prev) => ({ ...prev, isOpen: false }))}
        title={playerConfig.title}
        videoUrl={playerConfig.videoUrl}
        isTrailer={playerConfig.isTrailer}
        movie={movie}
        season={playerConfig.season}
        episode={playerConfig.episode}
        onSelectEpisode={(sNum, epNum) => playEpisodeHandler(sNum, epNum)}
      />
    </>
  );
};

export default MovieDetails;
