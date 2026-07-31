import { askMovieAI } from "../services/aiService.js";
import { searchMultipleMovies } from "../services/aiTmdbService.js";
import crypto from "crypto";

const chatWithAI = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    // Generate session if frontend doesn't send one
    const currentSessionId = sessionId || crypto.randomUUID();

    const aiResponse = await askMovieAI(
      currentSessionId,
      message
    );

    if (aiResponse.type === "recommendation") {
      // Pass full objects with media_type hints for better TMDB matching
      const movieHints = aiResponse.movies.map(
        (movie) => ({
          title: movie.title,
          media_type: movie.media_type || null,
        })
      );

      const movies = await searchMultipleMovies(
        movieHints,
        aiResponse.filters || {}
      );

      return res.status(200).json({
        success: true,
        sessionId: currentSessionId,
        type: "recommendation",
        message: aiResponse.message,
        filters: aiResponse.filters || {},
        movies,
      });
    }

    return res.status(200).json({
      success: true,
      sessionId: currentSessionId,
      type: "chat",
      message: aiResponse.message,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "AI request failed.",
    });
  }
};

export { chatWithAI };