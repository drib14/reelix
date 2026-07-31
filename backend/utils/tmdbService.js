import axios from "axios";

const getTMDB = () => {
  return axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
  });
};

// =======================
// In-Memory API Cache (#34)
// =======================

const apiCache = new Map();
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes

const fetchWithCache = async (key, fetchFn, ttl = DEFAULT_TTL_MS) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetchFn();
  apiCache.set(key, { data, timestamp: Date.now() });

  // Evict old entries if cache grows beyond 500 items
  if (apiCache.size > 500) {
    const oldestKey = apiCache.keys().next().value;
    apiCache.delete(oldestKey);
  }

  return data;
};

// =======================
// DRY Formatter Helper (#13)
// =======================

export const formatTMDBMovie = (item, forcedType = null) => {
  if (!item) return null;
  const isTV = forcedType === "tv" || item.media_type === "tv" || !!item.first_air_date || !!item.name;

  const fallbackPoster = "";
  const fallbackBackdrop = "";

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : item.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
    : fallbackPoster;

  const backdropUrl = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : item.poster_path
    ? `https://image.tmdb.org/t/p/original${item.poster_path}`
    : fallbackBackdrop;

  return {
    _id: String(item.id),
    id: item.id,
    name: isTV ? (item.name || item.original_name) : (item.title || item.original_title),
    title: isTV ? (item.name || item.original_name) : (item.title || item.original_title),
    overview: item.overview || "No overview available.",
    rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
    voteCount: item.vote_count || 0,
    year: isTV
      ? item.first_air_date ? item.first_air_date.substring(0, 4) : "N/A"
      : item.release_date ? item.release_date.substring(0, 4) : "N/A",
    releaseDate: isTV ? item.first_air_date : item.release_date,
    media_type: isTV ? "tv" : "movie",
    poster: posterUrl,
    backdrop: backdropUrl,
    image: posterUrl,
    popularity: item.popularity || 0,
  };
};

// =======================
// Movie Category Endpoints (with pagination #B10)
// =======================

export const getTrendingMovies = async (page = 1) => {
  return fetchWithCache(`trending-movie-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/trending/movie/week", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "movie"));
  });
};

export const getPopularMovies = async (page = 1) => {
  return fetchWithCache(`popular-movie-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/movie/popular", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "movie"));
  });
};

export const getTopRatedMovies = async (page = 1) => {
  return fetchWithCache(`top-rated-movie-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/movie/top_rated", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "movie"));
  });
};

export const getUpcomingMovies = async (page = 1) => {
  return fetchWithCache(`upcoming-movie-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/movie/upcoming", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "movie"));
  });
};

export const getNowPlayingMovies = async (page = 1) => {
  return fetchWithCache(`now-playing-movie-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/movie/now_playing", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "movie"));
  });
};

// =======================
// TV Category Endpoints (#B1)
// =======================

export const getTrendingTv = async (page = 1) => {
  return fetchWithCache(`trending-tv-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/trending/tv/week", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "tv"));
  });
};

export const getPopularTv = async (page = 1) => {
  return fetchWithCache(`popular-tv-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/tv/popular", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "tv"));
  });
};

export const getTopRatedTv = async (page = 1) => {
  return fetchWithCache(`top-rated-tv-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/tv/top_rated", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "tv"));
  });
};

export const getAiringTodayTv = async (page = 1) => {
  return fetchWithCache(`airing-today-tv-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/tv/airing_today", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "tv"));
  });
};

export const getOnTheAirTv = async (page = 1) => {
  return fetchWithCache(`on-the-air-tv-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/tv/on_the_air", { params: { page } });
    return (data.results || []).map((i) => formatTMDBMovie(i, "tv"));
  });
};

// =======================
// Trending All (Mixed Movies + TV #B3)
// =======================

export const getTrendingAll = async (page = 1) => {
  return fetchWithCache(`trending-all-${page}`, async () => {
    const tmdb = getTMDB();
    const { data } = await tmdb.get("/trending/all/week", { params: { page } });
    return (data.results || [])
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((i) => formatTMDBMovie(i));
  });
};

// =======================
// Movie & TV Genres
// =======================

export const getGenres = async () => {
  const tmdb = getTMDB();
  const { data } = await tmdb.get("/genre/movie/list");
  return data.genres;
};

export const getTvGenres = async () => {
  const tmdb = getTMDB();
  const { data } = await tmdb.get("/genre/tv/list");
  return data.genres;
};

// =======================
// Watch Providers & Countries
// =======================

export const getWatchProviders = async (type = "movie", region = "US") => {
  const tmdb = getTMDB();
  try {
    const endpoint = type === "tv" ? "/watch/providers/tv" : "/watch/providers/movie";
    const { data } = await tmdb.get(endpoint, {
      params: { watch_region: region },
    });
    return data.results || [];
  } catch (error) {
    return [
      { provider_id: 8, provider_name: "Netflix", logo_path: "/9A1JSVm2xs2jYd2v9Yw1w2y3z4.jpg" },
      { provider_id: 337, provider_name: "Disney+", logo_path: "/97yvRB8vvuZcT7Z2K2z1.jpg" },
      { provider_id: 9, provider_name: "Amazon Prime Video", logo_path: "/688v1B7vvuZcT7Z2K2z1.jpg" },
      { provider_id: 350, provider_name: "Apple TV+", logo_path: "/2Evdd7Z2K2z1.jpg" },
      { provider_id: 1899, provider_name: "Max", logo_path: "/fksn3v2.jpg" },
      { provider_id: 15, provider_name: "Hulu", logo_path: "/z7v1B7.jpg" },
      { provider_id: 158, provider_name: "Viu", logo_path: "/viu.jpg" },
      { provider_id: 581, provider_name: "iQIYI", logo_path: "/iqiyi.jpg" },
    ];
  }
};

export const getCountries = async () => {
  const tmdb = getTMDB();
  try {
    const { data } = await tmdb.get("/configuration/countries");
    return data;
  } catch (error) {
    return [
      { iso_3166_1: "PH", english_name: "Philippines" },
      { iso_3166_1: "US", english_name: "United States" },
      { iso_3166_1: "KR", english_name: "South Korea" },
      { iso_3166_1: "JP", english_name: "Japan" },
      { iso_3166_1: "GB", english_name: "United Kingdom" },
      { iso_3166_1: "FR", english_name: "France" },
      { iso_3166_1: "IN", english_name: "India" },
      { iso_3166_1: "ES", english_name: "Spain" },
      { iso_3166_1: "TH", english_name: "Thailand" },
    ];
  }
};

// =======================
// Single Movie & TV Details (Rich Append #B5, #B6, #B8, #B9)
// =======================

export const getMovieDetails = async (id) => {
  const tmdb = getTMDB();
  const { data } = await tmdb.get(
    `/movie/${id}?append_to_response=credits,videos,similar,recommendations,images,keywords,release_dates`
  );
  return data;
};

export const getTvDetails = async (id) => {
  const tmdb = getTMDB();
  const { data } = await tmdb.get(
    `/tv/${id}?append_to_response=credits,videos,similar,recommendations,images,keywords,content_ratings`
  );
  return data;
};

export const getTvSeasonDetails = async (id, seasonNumber) => {
  const tmdb = getTMDB();
  const { data } = await tmdb.get(`/tv/${id}/season/${seasonNumber}`);
  return data;
};

// =======================
// Person / Actor Details (#B4)
// =======================

export const getPersonDetails = async (id) => {
  const tmdb = getTMDB();
  const { data } = await tmdb.get(`/person/${id}?append_to_response=combined_credits,images`);
  return data;
};

// =======================
// Collection / Franchise Details (#B7)
// =======================

export const getCollectionDetails = async (id) => {
  const tmdb = getTMDB();
  const { data } = await tmdb.get(`/collection/${id}`);
  return data;
};

// =======================
// Search Movies & TV (with pagination #B11)
// =======================

export const searchTMDBMovies = async (keyword, type = "movie", page = 1) => {
  const tmdb = getTMDB();
  const endpoint = type === "tv" ? "/search/tv" : type === "all" ? "/search/multi" : "/search/movie";

  const { data } = await tmdb.get(endpoint, {
    params: {
      query: keyword,
      page,
    },
  });

  return (data.results || [])
    .filter((item) => item.media_type !== "person")
    .map((item) => formatTMDBMovie(item, type === "tv" ? "tv" : type === "movie" ? "movie" : null));
};

// =======================
// Discover Movies & TV Shows Multi-Criteria
// =======================

export const discoverMovies = async ({
  type = "movie",
  genre,
  platform,
  country,
  year,
  rating,
  sort = "popularity",
  page = 1,
  region = "US",
  isAnime = false,
}) => {
  const tmdb = getTMDB();
  const isTv = type === "tv" || isAnime;
  const endpoint = isTv ? "/discover/tv" : "/discover/movie";

  const sortMap = {
    popularity: "popularity.desc",
    rating: "vote_average.desc",
    newest: isTv ? "first_air_date.desc" : "primary_release_date.desc",
    oldest: isTv ? "first_air_date.asc" : "primary_release_date.asc",
  };

  const effectiveRegion = country || region || "US";

  // Combine genre if anime requested
  let withGenres = genre;
  if (isAnime) {
    withGenres = genre ? `16,${genre}` : "16"; // 16 = Animation
  }

  const params = {
    with_genres: withGenres || undefined,
    sort_by: sortMap[sort] || "popularity.desc",
    with_watch_providers: platform || undefined,
    watch_region: platform ? effectiveRegion : undefined,
    with_origin_country: isAnime ? "JP" : country || undefined,
    "vote_average.gte": rating ? parseFloat(rating) : undefined,
    page,
  };

  if (isTv) {
    if (year) params.first_air_date_year = year;
  } else {
    if (year) params.primary_release_year = year;
  }

  const { data } = await tmdb.get(endpoint, { params });

  return (data.results || []).map((item) => formatTMDBMovie(item, isTv ? "tv" : "movie"));
};