import express from "express";
const router = express.Router();

// Controllers
import {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
  getTrending,
  getPopular,
  getTopRated,
  getUpcoming,
  getMovieGenres,
  getTvGenresController,
  getPlatformsController,
  getCountriesController,
  getTvDetailsController,
  getTvSeasonDetailsController,
  discoverMoviesController,
  searchMovies,
  getTrendingTvController,
  getPopularTvController,
  getTopRatedTvController,
  getAiringTodayTvController,
  getOnTheAirTvController,
  getNowPlayingMoviesController,
  getTrendingAllController,
  getPersonDetailsController,
  getCollectionDetailsController,
  getTrailerController,
  getMovieReviews,
  createMovieReview,
  toggleLikeReview,
  deleteMovieReview,
} from "../controllers/movieController.js";

// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";

// ================= PUBLIC ROUTES =================

router.get("/all-movies", getAllMovies);

router.get("/specific-movie/:id", getSpecificMovie);

router.get("/tv/:id", getTvDetailsController);

router.get("/tv/:id/season/:seasonNumber", getTvSeasonDetailsController);

router.get("/person/:id", getPersonDetailsController);

router.get("/collection/:id", getCollectionDetailsController);

router.get("/:id/trailer", cacheMiddleware(3600), getTrailerController);

// MongoDB Community Reviews
router.get("/:id/reviews", getMovieReviews);
router.post("/:id/reviews", authenticate, createMovieReview);
router.post("/:id/reviews/:reviewId/like", authenticate, toggleLikeReview);
router.delete("/:id/reviews/:reviewId", authenticate, deleteMovieReview);

router.get("/new-movies", getNewMovies);

router.get("/top-movies", getTopMovies);

router.get("/random-movies", getRandomMovies);

// ================= TMDB CATEGORY ROUTES =================

router.get("/trending", getTrending);

router.get("/trending-tv", getTrendingTvController);

router.get("/trending-all", getTrendingAllController);

router.get("/popular", getPopular);

router.get("/popular-tv", getPopularTvController);

router.get("/top-rated", getTopRated);

router.get("/top-rated-tv", getTopRatedTvController);

router.get("/airing-today", getAiringTodayTvController);

router.get("/on-the-air", getOnTheAirTvController);

router.get("/now-playing", getNowPlayingMoviesController);

router.get("/upcoming", getUpcoming);

// ================= TMDB GENRES & METADATA =================

router.get("/genres", cacheMiddleware(300), getMovieGenres);

router.get("/tv-genres", cacheMiddleware(300), getTvGenresController);

router.get("/platforms", cacheMiddleware(300), getPlatformsController);

router.get("/countries", cacheMiddleware(300), getCountriesController);

// ================= DISCOVER MEDIA =================

router.get("/discover", discoverMoviesController);

// ================= SEARCH =================

router.get("/search/:keyword", searchMovies);

// ================= REVIEW ROUTES =================

router.post("/:id/reviews", authenticate, checkId, movieReview);

// ================= ADMIN ROUTES =================

router.post(
  "/create-movie",
  authenticate,
  authorizeAdmin,
  createMovie
);

router.put(
  "/update-movie/:id",
  authenticate,
  authorizeAdmin,
  updateMovie
);

router.delete(
  "/delete-movie/:id",
  authenticate,
  authorizeAdmin,
  deleteMovie
);

router.delete(
  "/delete-comment",
  authenticate,
  authorizeAdmin,
  deleteComment
);

export default router;