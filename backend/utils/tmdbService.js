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
// Trending Movies
// =======================

export const getTrendingMovies = async () => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get("/trending/movie/week");

  return data.results;
};

// =======================
// Popular Movies
// =======================

export const getPopularMovies = async () => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get("/movie/popular");

  return data.results;
};

// =======================
// Top Rated Movies
// =======================

export const getTopRatedMovies = async () => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get("/movie/top_rated");

  return data.results;
};

// =======================
// Upcoming Movies
// =======================

export const getUpcomingMovies = async () => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get("/movie/upcoming");

  return data.results;
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
// Single Movie & TV Show Details
// =======================

export const getMovieDetails = async (id) => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get(
    `/movie/${id}?append_to_response=credits,videos,similar`
  );

  return data;
};

export const getTvDetails = async (id) => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get(
    `/tv/${id}?append_to_response=credits,videos,similar`
  );

  return data;
};

export const getTvSeasonDetails = async (id, seasonNumber) => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get(
    `/tv/${id}/season/${seasonNumber}`
  );

  return data;
};


// =======================
// Search Movies & TV
// =======================

export const searchTMDBMovies = async (keyword, type = "movie") => {
  const tmdb = getTMDB();

  const endpoint = type === "tv" ? "/search/tv" : type === "all" ? "/search/multi" : "/search/movie";

  const { data } = await tmdb.get(endpoint, {
    params: {
      query: keyword,
    },
  });

  return (data.results || []).map((item) => ({
    ...item,
    media_type: item.media_type || (type === "tv" ? "tv" : "movie"),
  }));
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
}) => {
  const tmdb = getTMDB();

  const isTv = type === "tv";
  const endpoint = isTv ? "/discover/tv" : "/discover/movie";

  const sortMap = {
    popularity: "popularity.desc",
    rating: "vote_average.desc",
    newest: isTv ? "first_air_date.desc" : "primary_release_date.desc",
    oldest: isTv ? "first_air_date.asc" : "primary_release_date.asc",
  };

  const effectiveRegion = country || region || "US";

  const params = {
    with_genres: genre || undefined,
    sort_by: sortMap[sort] || "popularity.desc",
    with_watch_providers: platform || undefined,
    watch_region: platform ? effectiveRegion : undefined,
    with_origin_country: country || undefined,
    "vote_average.gte": rating ? parseFloat(rating) : undefined,
    page,
  };

  if (isTv) {
    if (year) params.first_air_date_year = year;
  } else {
    if (year) params.primary_release_year = year;
  }

  const { data } = await tmdb.get(endpoint, { params });

  return (data.results || []).map((item) => ({
    ...item,
    media_type: isTv ? "tv" : "movie",
  }));
};