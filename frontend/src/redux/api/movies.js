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

    getMovieReviews: builder.query({
      query: (id) => `${MOVIE_URL}/${id}/reviews`,
    }),

    addMovieReview: builder.mutation({
      query: ({ id, rating, comment }) => ({
        url: `${MOVIE_URL}/${id}/reviews`,
        method: "POST",
        body: { rating, comment },
      }),
    }),

    toggleLikeReview: builder.mutation({
      query: ({ movieId, reviewId }) => ({
        url: `${MOVIE_URL}/${movieId}/reviews/${reviewId}/like`,
        method: "POST",
      }),
    }),

    deleteReview: builder.mutation({
      query: ({ movieId, reviewId }) => ({
        url: `${MOVIE_URL}/${movieId}/reviews/${reviewId}`,
        method: "DELETE",
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
      query: (page = 1) => `${MOVIE_URL}/trending?page=${page}`,
    }),

    getTrendingTv: builder.query({
      query: (page = 1) => `${MOVIE_URL}/trending-tv?page=${page}`,
    }),

    getTrendingAll: builder.query({
      query: (page = 1) => `${MOVIE_URL}/trending-all?page=${page}`,
    }),

    getPopularMovies: builder.query({
      query: (page = 1) => `${MOVIE_URL}/popular?page=${page}`,
    }),

    getPopularTv: builder.query({
      query: (page = 1) => `${MOVIE_URL}/popular-tv?page=${page}`,
    }),

    getTopRatedMovies: builder.query({
      query: (page = 1) => `${MOVIE_URL}/top-rated?page=${page}`,
    }),

    getTopRatedTv: builder.query({
      query: (page = 1) => `${MOVIE_URL}/top-rated-tv?page=${page}`,
    }),

    getAiringTodayTv: builder.query({
      query: (page = 1) => `${MOVIE_URL}/airing-today?page=${page}`,
    }),

    getOnTheAirTv: builder.query({
      query: (page = 1) => `${MOVIE_URL}/on-the-air?page=${page}`,
    }),

    getNowPlayingMovies: builder.query({
      query: (page = 1) => `${MOVIE_URL}/now-playing?page=${page}`,
    }),

    getUpcomingMovies: builder.query({
      query: (page = 1) => `${MOVIE_URL}/upcoming?page=${page}`,
    }),

    getPersonDetails: builder.query({
      query: (id) => `${MOVIE_URL}/person/${id}`,
    }),

    getCollectionDetails: builder.query({
      query: (id) => `${MOVIE_URL}/collection/${id}`,
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

    getTvSeasonDetails: builder.query({
      query: ({ id, season }) => `${MOVIE_URL}/tv/${id}/season/${season}`,
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
  useGetMovieReviewsQuery,
  useAddMovieReviewMutation,
  useToggleLikeReviewMutation,
  useDeleteReviewMutation,
  useDeleteCommentMutation,
  useGetSpecificMovieQuery,
  useGetTvDetailsQuery,
  useGetTvSeasonDetailsQuery,
  useUploadImageMutation,
  useDeleteMovieMutation,

  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,

  useGetTrendingMoviesQuery,
  useGetTrendingTvQuery,
  useGetTrendingAllQuery,
  useGetPopularMoviesQuery,
  useGetPopularTvQuery,
  useGetTopRatedMoviesQuery,
  useGetTopRatedTvQuery,
  useGetAiringTodayTvQuery,
  useGetOnTheAirTvQuery,
  useGetNowPlayingMoviesQuery,
  useGetUpcomingMoviesQuery,
  useGetPersonDetailsQuery,
  useGetCollectionDetailsQuery,

  useGetGenresQuery,
  useGetTvGenresQuery,
  useGetPlatformsQuery,
  useGetCountriesQuery,
  useDiscoverMoviesQuery,

  useSearchMoviesQuery,
} = moviesApiSlice;