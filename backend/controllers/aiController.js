import { askMovieAI, getVibeAI } from "../services/aiService.js";
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

const vibeRecommendationController = async (req, res) => {
  try {
    const { mood, energy, tone, prompt } = req.body;

    const aiResult = await getVibeAI({ mood, energy, tone, prompt });

    if (aiResult && aiResult.movies) {
      const movieHints = aiResult.movies.map((m) => ({
        title: m.title,
        media_type: m.media_type || null,
      }));

      const resolvedMovies = await searchMultipleMovies(movieHints, {});

      // Attach AI reasons to resolved movie objects
      const finalMovies = resolvedMovies.map((movie, index) => {
        const aiMatch = aiResult.movies[index];
        return {
          ...movie,
          aiReason: aiMatch ? aiMatch.reason : undefined,
        };
      });

      return res.status(200).json({
        success: true,
        vibeTitle: aiResult.vibeTitle || "Curated Vibe Watchlist",
        vibeSummary: aiResult.vibeSummary || "Here are hand-picked recommendations matching your mood.",
        movies: finalMovies,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Could not generate vibe recommendations.",
    });
  } catch (error) {
    console.error("Vibe Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vibe recommendations.",
    });
  }
};

export { chatWithAI, vibeRecommendationController };