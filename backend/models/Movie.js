import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    poster: {
      type: String,
      required: true,
    },

    backdrop: {
      type: String,
      default: "",
    },

    overview: {
      type: String,
      required: true,
    },

    releaseDate: {
      type: Date,
    },

    year: {
      type: Number,
    },

    runtime: {
      type: Number,
    },

    language: {
      type: String,
    },

    rating: {
      type: Number,
      default: 0,
    },

    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],

    cast: [
      {
        type: String,
      },
    ],

    director: {
      type: String,
      default: "",
    },

    trailer: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    reviews: [reviewSchema],

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;