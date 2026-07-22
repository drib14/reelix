import axios from "axios";

// ==========================================
// Genre Mapping
// ==========================================

const GENRE_MAP = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "science fiction": 878,
  "sci-fi": 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

// ==========================================
// Search Movie by Title
// ==========================================

export const searchMovieByTitle = async (title) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: title,
          include_adult: false,
        },
      }
    );

    if (!response.data.results?.length) {
      return null;
    }

    const movie = response.data.results[0];

    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      rating: movie.vote_average,
      releaseDate: movie.release_date,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,
    };
  } catch (error) {
    console.error("TMDB Search Error:", error.message);
    return null;
  }
};

// ==========================================
// Apply AI Filters
// ==========================================

const applyFilters = (movies, filters = {}) => {
  return movies.filter((movie) => {
    // Rating filter
    if (filters.rating) {
      const rating = Number(filters.rating);

      if (!isNaN(rating) && movie.rating < rating) {
        return false;
      }
    }

    // Year filter
    if (filters.year) {
      const year = parseInt(movie.releaseDate?.substring(0, 4));

      if (filters.year.startsWith(">")) {
        if (year <= Number(filters.year.substring(1))) {
          return false;
        }
      } else if (filters.year.startsWith("<")) {
        if (year >= Number(filters.year.substring(1))) {
          return false;
        }
      } else if (!isNaN(Number(filters.year))) {
        if (year !== Number(filters.year)) {
          return false;
        }
      }
    }

    return true;
  });
};

// ==========================================
// Search Multiple Movies
// ==========================================

export const searchMultipleMovies = async (
  titles = [],
  filters = {}
) => {
  const movies = [];

  for (const title of titles) {
    const movie = await searchMovieByTitle(title);

    if (movie) {
      movies.push(movie);
    }
  }

  let filteredMovies = applyFilters(movies, filters);

  // Genre filter
  if (filters.genre) {
    const genreId =
      GENRE_MAP[filters.genre.toLowerCase()];

    if (genreId) {
      const genreMovies = [];

      for (const movie of filteredMovies) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            {
              params: {
                api_key: process.env.TMDB_API_KEY,
              },
            }
          );

          const genres = response.data.genres.map(
            (genre) => genre.id
          );

          if (genres.includes(genreId)) {
            genreMovies.push(movie);
          }
        } catch (error) {
          console.error(
            "Genre filter error:",
            error.message
          );
        }
      }

      filteredMovies = genreMovies;
    }
  }

  return filteredMovies;
};