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
  discoverMoviesController,
  searchMovies,
} from "../controllers/movieController.js";

// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// ================= PUBLIC ROUTES =================

router.get("/all-movies", getAllMovies);

router.get("/specific-movie/:id", getSpecificMovie);

router.get("/new-movies", getNewMovies);

router.get("/top-movies", getTopMovies);

router.get("/random-movies", getRandomMovies);

// ================= TMDB CATEGORY ROUTES =================

router.get("/trending", getTrending);

router.get("/popular", getPopular);

router.get("/top-rated", getTopRated);

router.get("/upcoming", getUpcoming);

// ================= TMDB GENRES =================

router.get("/genres", getMovieGenres);

// ================= DISCOVER MOVIES =================

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