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
    // TMDB GENRES
    // =========================

    getGenres: builder.query({
      query: () => `${MOVIE_URL}/genres`,
    }),

    // =========================
    // DISCOVER MOVIES
    // =========================

    discoverMovies: builder.query({
      query: ({
        genre = "",
        sort = "popularity",
        year = "",
        language = "",
        page = 1,
      }) => ({
        url: `${MOVIE_URL}/discover`,
        params: {
          genre,
          sort,
          year,
          language,
          page,
        },
      }),
    }),

    // =========================
    // SEARCH
    // =========================

    searchMovies: builder.query({
      query: (keyword) => `${MOVIE_URL}/search/${keyword}`,
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
  useDiscoverMoviesQuery,

  useSearchMoviesQuery,
} = moviesApiSlice;