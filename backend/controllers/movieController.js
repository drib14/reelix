import Movie from "../models/Movie.js";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieDetails,
  searchTMDBMovies,
  getGenres,
  discoverMovies,
} from "../utils/tmdbService.js";

const createMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();

    res.json(savedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpecificMovie = async (req, res) => {
  try {
    const movie = await getMovieDetails(req.params.id);

    const trailer = movie.videos?.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    );

    const director = movie.credits?.crew?.find(
      (person) => person.job === "Director"
    );

    const formattedMovie = {
      _id: movie.id,

      name: movie.title,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "",

      overview: movie.overview,

      releaseDate: movie.release_date,

      year: movie.release_date
        ? parseInt(movie.release_date.split("-")[0])
        : null,

      runtime: movie.runtime,

      language: movie.original_language,

      status: movie.status,

      rating: movie.vote_average,

      genres: movie.genres || [],

      director: director?.name || "",

      trailer: trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : "",

      cast:
        movie.credits?.cast?.slice(0, 10).map((actor) => ({
          id: actor.id,
          name: actor.name,
          character: actor.character,
          image: actor.profile_path
            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
            : "",
        })) || [],

      similar:
        movie.similar?.results?.slice(0, 10).map((item) => ({
          id: item.id,
          name: item.title,
          poster: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "",
        })) || [],

      reviews: [],
      numReviews: 0,
    };

    res.json(formattedMovie);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
const movieReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    const alreadyReviewed = movie.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "Movie already reviewed",
      });
    }

    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    movie.reviews.push(review);

    movie.numReviews = movie.reviews.length;

    movie.rating =
      movie.reviews.reduce((acc, item) => acc + item.rating, 0) /
      movie.reviews.length;

    await movie.save();

    res.status(201).json({
      message: "Review Added",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json({
      message: "Movie Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { movieId, reviewId } = req.body;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    const reviewIndex = movie.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    movie.reviews.splice(reviewIndex, 1);

    movie.numReviews = movie.reviews.length;

    movie.rating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((acc, item) => acc + item.rating, 0) /
          movie.reviews.length
        : 0;

    await movie.save();

    res.json({
      message: "Comment Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
const getNewMovies = async (req, res) => {
  try {
    const newMovies = await Movie.find().sort({ createdAt: -1 }).limit(10);

    res.json(newMovies);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getTopMovies = async (req, res) => {
  try {
    const topMovies = await Movie.find().sort({ rating: -1 }).limit(10);

    res.json(topMovies);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getRandomMovies = async (req, res) => {
  try {
    const movies = await getTrendingMovies();

    const formattedMovies = movies.map((movie) => ({
      _id: movie.id,

      name: movie.title,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "",

      overview: movie.overview,

      releaseDate: movie.release_date,

      year: movie.release_date
        ? parseInt(movie.release_date.split("-")[0])
        : null,

      rating: movie.vote_average,

      genres: movie.genre_ids || [],

      language: movie.original_language,
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};
const getTrending = async (req, res) => {
  try {
    const movies = await getTrendingMovies();

    const formattedMovies = movies.map((movie) => ({
      _id: movie.id,

      name: movie.title,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "",

      overview: movie.overview,

      releaseDate: movie.release_date,

      year: movie.release_date
        ? parseInt(movie.release_date.split("-")[0])
        : null,

      rating: movie.vote_average,

      genres: movie.genre_ids || [],

      language: movie.original_language,
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

const getPopular = async (req, res) => {
  try {
    const movies = await getPopularMovies();

    const formattedMovies = movies.map((movie) => ({
      _id: movie.id,

      name: movie.title,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "",

      overview: movie.overview,

      releaseDate: movie.release_date,

      year: movie.release_date
        ? parseInt(movie.release_date.split("-")[0])
        : null,

      rating: movie.vote_average,

      genres: movie.genre_ids || [],

      language: movie.original_language,
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};
const getTopRated = async (req, res) => {
  try {
    const movies = await getTopRatedMovies();

    const formattedMovies = movies.map((movie) => ({
      _id: movie.id,

      name: movie.title,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "",

      overview: movie.overview,

      releaseDate: movie.release_date,

      year: movie.release_date
        ? parseInt(movie.release_date.split("-")[0])
        : null,

      rating: movie.vote_average,

      genres: movie.genre_ids || [],

      language: movie.original_language,
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

const getUpcoming = async (req, res) => {
  try {
    const movies = await getUpcomingMovies();

    const formattedMovies = movies.map((movie) => ({
      _id: movie.id,

      name: movie.title,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "",

      overview: movie.overview,

      releaseDate: movie.release_date,

      year: movie.release_date
        ? parseInt(movie.release_date.split("-")[0])
        : null,

      rating: movie.vote_average,

      genres: movie.genre_ids || [],

      language: movie.original_language,
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// =======================
// Movie Genres
// =======================

const getMovieGenres = async (req, res) => {
  try {
    const genres = await getGenres();

    res.json(genres);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// =======================
// Discover Movies
// =======================

const discoverMoviesController = async (req, res) => {
  try {
    const {
      genre,
      sort,
      year,
      language,
      page,
    } = req.query;

    const movies = await discoverMovies({
      genre,
      sort,
      year,
      language,
      page,
    });

    const formattedMovies = movies.map((movie) => ({
      _id: movie.id,

      name: movie.title,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "",

      overview: movie.overview,

      releaseDate: movie.release_date,

      year: movie.release_date
        ? parseInt(movie.release_date.split("-")[0])
        : null,

      rating: movie.vote_average,

      genres: movie.genre_ids || [],

      language: movie.original_language,
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

const searchMovies = async (req, res) => {
  try {
    const { keyword } = req.params;

    const movies = await searchTMDBMovies(keyword);

    const formattedMovies = movies.map((movie) => ({
      _id: movie.id,

      name: movie.title,

      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "",

      overview: movie.overview,

      releaseDate: movie.release_date,

      year: movie.release_date
        ? parseInt(movie.release_date.split("-")[0])
        : null,

      rating: movie.vote_average,

      genres: movie.genre_ids || [],

      language: movie.original_language,
    }));

    res.json(formattedMovies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

export {
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
};