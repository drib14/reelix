import Movie from "../models/Movie.js";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieDetails,
  getTvDetails,
  getTvSeasonDetails,
  searchTMDBMovies,
  getGenres,
  getTvGenres,
  getWatchProviders,
  getCountries,
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
    let movie;
    let isTv = false;

    try {
      movie = await getMovieDetails(req.params.id);
    } catch (movieErr) {
      // Fallback: Check if ID is actually a TV Series
      try {
        movie = await getTvDetails(req.params.id);
        isTv = true;
      } catch (tvErr) {
        throw movieErr;
      }
    }

    if (isTv) {
      const trailer = movie.videos?.results?.find(
        (video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser")
      );

      const formattedTv = {
        _id: movie.id,
        name: movie.name || movie.original_name,
        media_type: "tv",
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
        backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : "",
        overview: movie.overview,
        releaseDate: movie.first_air_date,
        year: movie.first_air_date ? parseInt(movie.first_air_date.split("-")[0]) : null,
        rating: movie.vote_average,
        genres: movie.genres || [],
        trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        numberOfSeasons: movie.number_of_seasons,
        numberOfEpisodes: movie.number_of_episodes,
        seasons: movie.seasons || [],
        cast: movie.credits?.cast?.slice(0, 10).map((actor) => ({
          id: actor.id,
          name: actor.name,
          character: actor.character,
          image: actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "",
        })) || [],
        similar: movie.similar?.results?.slice(0, 10).map((item) => ({
          id: item.id,
          name: item.name || item.title,
          media_type: "tv",
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        })) || [],
        reviews: [],
        numReviews: 0,
      };

      return res.json(formattedTv);
    }

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

      videoUrl: movie.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",

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
// Platforms & Countries & Tv Genres
// =======================

const getPlatformsController = async (req, res) => {
  try {
    const { type = "movie", region = "US" } = req.query;
    const providers = await getWatchProviders(type, region);
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCountriesController = async (req, res) => {
  try {
    const countries = await getCountries();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTvGenresController = async (req, res) => {
  try {
    const genres = await getTvGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTvDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    const tv = await getTvDetails(id);

    const trailer = tv.videos?.results?.find(
      (video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser")
    );

    const formattedTv = {
      _id: tv.id,
      name: tv.name || tv.original_name,
      media_type: "tv",
      poster: tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : "",
      backdrop: tv.backdrop_path ? `https://image.tmdb.org/t/p/original${tv.backdrop_path}` : "",
      overview: tv.overview,
      releaseDate: tv.first_air_date,
      year: tv.first_air_date ? parseInt(tv.first_air_date.split("-")[0]) : null,
      rating: tv.vote_average,
      genres: tv.genres || [],
      trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      numberOfSeasons: tv.number_of_seasons,
      numberOfEpisodes: tv.number_of_episodes,
      seasons: tv.seasons || [],
      cast: tv.credits?.cast?.slice(0, 10).map((actor) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        image: actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "",
      })) || [],
      similar: tv.similar?.results?.slice(0, 10).map((item) => ({
        id: item.id,
        name: item.name || item.title,
        media_type: "tv",
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
      })) || [],
      reviews: [],
      numReviews: 0,
    };

    res.json(formattedTv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTvSeasonDetailsController = async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    const sNum = parseInt(seasonNumber) || 1;

    try {
      const seasonData = await getTvSeasonDetails(id, sNum);

      const formattedSeason = {
        season_number: seasonData.season_number,
        name: seasonData.name || `Season ${seasonData.season_number}`,
        overview: seasonData.overview || "",
        poster: seasonData.poster_path ? `https://image.tmdb.org/t/p/w500${seasonData.poster_path}` : "",
        episodes: (seasonData.episodes || []).map((ep) => ({
          episodeNumber: ep.episode_number,
          title: ep.name || `Episode ${ep.episode_number}`,
          overview: ep.overview || `Episode ${ep.episode_number} of Season ${seasonData.season_number}.`,
          still: ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : "",
          runtime: ep.runtime || 24,
          airDate: ep.air_date || "",
          voteAverage: ep.vote_average || 0,
        })),
      };

      return res.json(formattedSeason);
    } catch (tmdbErr) {
      // Fallback for custom DB series or TMDB error
      const movie = await Movie.findById(id).catch(() => null);
      const totalEps = movie?.numberOfEpisodes || 24;
      const fallbackEps = [];

      for (let ep = 1; ep <= totalEps; ep++) {
        fallbackEps.push({
          episodeNumber: ep,
          title: `Episode ${ep}`,
          overview: `Episode ${ep} of Season ${sNum}. Stream in 1080p Ultra HD across all available servers.`,
          still: "",
          runtime: 24,
          airDate: "",
          voteAverage: 8.0,
        });
      }

      return res.json({
        season_number: sNum,
        name: `Season ${sNum}`,
        overview: "",
        poster: "",
        episodes: fallbackEps,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// =======================
// Discover Movies & TV Shows Multi-Criteria
// =======================

const discoverMoviesController = async (req, res) => {
  try {
    const {
      type = "movie",
      genre,
      platform,
      country,
      year,
      rating,
      sort,
      page,
      region = "US",
    } = req.query;

    const mediaList = await discoverMovies({
      type,
      genre,
      platform,
      country,
      year,
      rating,
      sort,
      page,
      region,
    });

    const formattedList = mediaList.map((item) => {
      const isTv = item.media_type === "tv" || type === "tv";
      const title = isTv ? (item.name || item.original_name) : (item.title || item.name);
      const date = isTv ? item.first_air_date : item.release_date;

      return {
        _id: item.id,
        name: title,
        media_type: isTv ? "tv" : "movie",
        poster: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : "",
        backdrop: item.backdrop_path
          ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
          : "",
        overview: item.overview,
        releaseDate: date,
        year: date ? parseInt(date.split("-")[0]) : null,
        rating: item.vote_average,
        genres: item.genre_ids || [],
        language: item.original_language,
        originCountry: item.origin_country?.[0] || "",
      };
    });

    res.json(formattedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const searchMovies = async (req, res) => {
  try {
    const { keyword } = req.params;
    const { type = "all" } = req.query;

    const movies = await searchTMDBMovies(keyword, type);

    const formattedMovies = (movies || [])
      .filter((item) => item.media_type !== "person")
      .map((item) => {
        const isTv = item.media_type === "tv" || (type === "tv" && item.media_type !== "movie");
        const title = item.title || item.name || item.original_title || item.original_name || "Untitled";
        const date = item.release_date || item.first_air_date || "";
        const posterPath = item.poster_path || item.backdrop_path || "";

        return {
          _id: item.id,
          name: title,
          media_type: isTv ? "tv" : "movie",
          poster: posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : "https://placehold.co/500x750?text=No+Poster",
          backdrop: item.backdrop_path
            ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
            : "",
          overview: item.overview || "",
          releaseDate: date,
          year: date && date.includes("-") ? parseInt(date.split("-")[0]) : null,
          rating: item.vote_average || 0,
          genres: item.genre_ids || [],
          language: item.original_language || "en",
        };
      });

    res.json(formattedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
  getTvGenresController,
  getPlatformsController,
  getCountriesController,
  getTvDetailsController,
  getTvSeasonDetailsController,
  discoverMoviesController,
  searchMovies,
};