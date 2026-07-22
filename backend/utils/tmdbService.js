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
// Movie Genres
// =======================

export const getGenres = async () => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get("/genre/movie/list");

  return data.genres;
};

// =======================
// Single Movie
// =======================

export const getMovieDetails = async (id) => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get(
    `/movie/${id}?append_to_response=credits,videos,similar`
  );

  return data;
};

// =======================
// Search Movies
// =======================

export const searchTMDBMovies = async (keyword) => {
  const tmdb = getTMDB();

  const { data } = await tmdb.get("/search/movie", {
    params: {
      query: keyword,
    },
  });

  return data.results;
};

// =======================
// Discover Movies
// =======================

export const discoverMovies = async ({
  genre,
  sort,
  year,
  language,
  page = 1,
}) => {
  const tmdb = getTMDB();

  const sortMap = {
    popularity: "popularity.desc",
    rating: "vote_average.desc",
    newest: "primary_release_date.desc",
    oldest: "primary_release_date.asc",
  };

  const { data } = await tmdb.get("/discover/movie", {
    params: {
      with_genres: genre || undefined,

      sort_by: sortMap[sort] || "popularity.desc",

      primary_release_year: year || undefined,

      with_original_language: language || undefined,

      page,
    },
  });

  return data.results;
};