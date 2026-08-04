import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the required fields");
  }

  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // Hash the user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      return res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
    }
  }

  // Generic 401 response to prevent user enumeration attacks
  res.status(401).json({ message: "Invalid email or password" });
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Watch History Controllers
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const sortedHistory = (user.watchHistory || []).sort(
    (a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)
  );

  res.status(200).json(sortedHistory);
});

const updateWatchHistory = asyncHandler(async (req, res) => {
  const {
    mediaId,
    mediaType = "movie",
    title,
    posterPath,
    backdropPath,
    season = 1,
    episode = 1,
    progressSeconds = 0,
    totalDurationSeconds = 0,
  } = req.body;

  if (!mediaId) {
    res.status(400);
    throw new Error("mediaId is required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.watchHistory) {
    user.watchHistory = [];
  }

  const existingIndex = user.watchHistory.findIndex(
    (item) => item.mediaId === String(mediaId)
  );

  if (existingIndex > -1) {
    user.watchHistory[existingIndex].mediaType = mediaType;
    if (title) user.watchHistory[existingIndex].title = title;
    if (posterPath) user.watchHistory[existingIndex].posterPath = posterPath;
    if (backdropPath) user.watchHistory[existingIndex].backdropPath = backdropPath;
    user.watchHistory[existingIndex].season = Number(season);
    user.watchHistory[existingIndex].episode = Number(episode);
    user.watchHistory[existingIndex].progressSeconds = Number(progressSeconds);
    user.watchHistory[existingIndex].totalDurationSeconds = Number(totalDurationSeconds);
    user.watchHistory[existingIndex].lastWatchedAt = new Date();
  } else {
    user.watchHistory.push({
      mediaId: String(mediaId),
      mediaType,
      title,
      posterPath,
      backdropPath,
      season: Number(season),
      episode: Number(episode),
      progressSeconds: Number(progressSeconds),
      totalDurationSeconds: Number(totalDurationSeconds),
      lastWatchedAt: new Date(),
    });
  }

  await user.save();

  const sortedHistory = user.watchHistory.sort(
    (a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)
  );

  res.status(200).json(sortedHistory);
});

const deleteWatchHistoryItem = asyncHandler(async (req, res) => {
  const { mediaId } = req.params;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.watchHistory = (user.watchHistory || []).filter(
    (item) => item.mediaId !== String(mediaId)
  );

  await user.save();
  res.status(200).json({ message: "Watch history item removed", watchHistory: user.watchHistory });
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getWatchHistory,
  updateWatchHistory,
  deleteWatchHistoryItem,
};
