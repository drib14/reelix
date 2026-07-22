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
      const titles = aiResponse.movies.map(
        (movie) => movie.title
      );

      const movies = await searchMultipleMovies(
        titles,
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