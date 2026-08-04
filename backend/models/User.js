import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    watchHistory: [
      {
        mediaId: { type: String, required: true },
        mediaType: { type: String, enum: ["movie", "tv"], default: "movie" },
        title: { type: String },
        posterPath: { type: String },
        backdropPath: { type: String },
        season: { type: Number, default: 1 },
        episode: { type: Number, default: 1 },
        progressSeconds: { type: Number, default: 0 },
        totalDurationSeconds: { type: Number, default: 0 },
        lastWatchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
