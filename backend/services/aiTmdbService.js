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
// Search by Title (Multi — Movies + TV + Anime)
// ==========================================

export const searchByTitle = async (title, preferredType = null) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/multi",
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

    // Filter out "person" results, keep only movie and tv
    const mediaResults = response.data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );

    if (mediaResults.length === 0) return null;

    // If the AI specified a preferred type, try to find that first
    let best = mediaResults[0];
    if (preferredType) {
      const preferred = mediaResults.find((r) => r.media_type === preferredType);
      if (preferred) best = preferred;
    }

    const isTV = best.media_type === "tv";

    return {
      id: best.id,
      title: isTV ? (best.name || best.original_name) : (best.title || best.original_title),
      overview: best.overview,
      rating: best.vote_average,
      releaseDate: isTV ? best.first_air_date : best.release_date,
      media_type: best.media_type,

      poster: best.poster_path
        ? `https://image.tmdb.org/t/p/w500${best.poster_path}`
        : null,

      backdrop: best.backdrop_path
        ? `https://image.tmdb.org/t/p/original${best.backdrop_path}`
        : null,
    };
  } catch (error) {
    console.error("TMDB Search Error:", error.message);
    return null;
  }
};

// Keep backward compatibility
export const searchMovieByTitle = searchByTitle;

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
// Search Multiple Movies/TV Shows (Parallel)
// ==========================================

export const searchMultipleMovies = async (
  titles = [],
  filters = {}
) => {
  // Search all titles in parallel instead of sequentially
  const results = await Promise.allSettled(
    titles.map((item) => {
      // Support both string titles and objects with media_type hint
      const title = typeof item === "string" ? item : item.title;
      const preferredType = typeof item === "string" ? null : item.media_type;
      return searchByTitle(title, preferredType);
    })
  );

  const movies = results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);

  let filteredMovies = applyFilters(movies, filters);

  // Genre filter
  if (filters.genre) {
    const genreId =
      GENRE_MAP[filters.genre.toLowerCase()];

    if (genreId) {
      // Fetch details in parallel for genre filtering
      const genreCheckResults = await Promise.allSettled(
        filteredMovies.map(async (movie) => {
          try {
            const endpoint = movie.media_type === "tv"
              ? `https://api.themoviedb.org/3/tv/${movie.id}`
              : `https://api.themoviedb.org/3/movie/${movie.id}`;

            const response = await axios.get(endpoint, {
              params: {
                api_key: process.env.TMDB_API_KEY,
              },
            });

            const genres = response.data.genres.map(
              (genre) => genre.id
            );

            return genres.includes(genreId) ? movie : null;
          } catch (error) {
            console.error(
              "Genre filter error:",
              error.message
            );
            return null;
          }
        })
      );

      filteredMovies = genreCheckResults
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);
    }
  }

  return filteredMovies;
};