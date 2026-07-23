import { apiSlice } from "./apiSlice";
import { MOVIE_URL, UPLOAD_URL } from "../constants";

export const moviesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMovies: builder.query({
      query: () => `${MOVIE_URL}/all-movies`,
    }),

    createMovie: builder.mutation({
      query: (newMovie) => ({
        url: `${MOVIE_URL}/create-movie`,
        method: "POST",
        body: newMovie,
      }),
    }),

    updateMovie: builder.mutation({
      query: ({ id, updatedMovie }) => ({
        url: `${MOVIE_URL}/update-movie/${id}`,
        method: "PUT",
        body: updatedMovie,
      }),
    }),

    addMovieReview: builder.mutation({
      query: ({ id, rating, comment }) => ({
        url: `${MOVIE_URL}/${id}/reviews`,
        method: "POST",
        body: { rating, id, comment },
      }),
    }),

    deleteComment: builder.mutation({
      query: ({ movieId, reviewId }) => ({
        url: `${MOVIE_URL}/delete-comment`,
        method: "DELETE",
        body: { movieId, reviewId },
      }),
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `${MOVIE_URL}/delete-movie/${id}`,
        method: "DELETE",
      }),
    }),

    getSpecificMovie: builder.query({
      query: (id) => `${MOVIE_URL}/specific-movie/${id}`,
    }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: formData,
      }),
    }),

    getNewMovies: builder.query({
      query: () => `${MOVIE_URL}/new-movies`,
    }),

    getTopMovies: builder.query({
      query: () => `${MOVIE_URL}/top-movies`,
    }),

    getRandomMovies: builder.query({
      query: () => `${MOVIE_URL}/random-movies`,
    }),

    // =========================
    // TMDB CATEGORY ROUTES
    // =========================

    getTrendingMovies: builder.query({
      query: () => `${MOVIE_URL}/trending`,
    }),

    getPopularMovies: builder.query({
      query: () => `${MOVIE_URL}/popular`,
    }),

    getTopRatedMovies: builder.query({
      query: () => `${MOVIE_URL}/top-rated`,
    }),

    getUpcomingMovies: builder.query({
      query: () => `${MOVIE_URL}/upcoming`,
    }),

    // =========================
    // TMDB GENRES & METADATA
    // =========================

    getGenres: builder.query({
      query: () => `${MOVIE_URL}/genres`,
    }),

    getTvGenres: builder.query({
      query: () => `${MOVIE_URL}/tv-genres`,
    }),

    getPlatforms: builder.query({
      query: ({ type = "movie", region = "US" } = {}) => `${MOVIE_URL}/platforms?type=${type}&region=${region}`,
    }),

    getCountries: builder.query({
      query: () => `${MOVIE_URL}/countries`,
    }),

    getTvDetails: builder.query({
      query: (id) => `${MOVIE_URL}/tv/${id}`,
    }),

    // =========================
    // DISCOVER MOVIES & TV
    // =========================

    discoverMovies: builder.query({
      query: ({
        type = "movie",
        genre = "",
        platform = "",
        country = "",
        year = "",
        rating = "",
        sort = "popularity",
        region = "US",
        page = 1,
      }) => ({
        url: `${MOVIE_URL}/discover`,
        params: {
          type,
          genre,
          platform,
          country,
          year,
          rating,
          sort,
          region,
          page,
        },
      }),
    }),

    // =========================
    // SEARCH
    // =========================

    searchMovies: builder.query({
      query: (args) => {
        if (typeof args === "string") {
          return `${MOVIE_URL}/search/${encodeURIComponent(args)}?type=all`;
        }
        const { keyword = "", type = "all" } = args || {};
        return `${MOVIE_URL}/search/${encodeURIComponent(keyword)}?type=${type}`;
      },
    }),
  }),
});

export const {
  useGetAllMoviesQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useAddMovieReviewMutation,
  useDeleteCommentMutation,
  useGetSpecificMovieQuery,
  useGetTvDetailsQuery,
  useUploadImageMutation,
  useDeleteMovieMutation,

  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,

  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,

  useGetGenresQuery,
  useGetTvGenresQuery,
  useGetPlatformsQuery,
  useGetCountriesQuery,
  useDiscoverMoviesQuery,

  useSearchMoviesQuery,
} = moviesApiSlice;