const API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:3000/api/v1/ai/chat";

// ======================================
// Session Management
// ======================================

let sessionId = localStorage.getItem("reelix-ai-session");

export const askMovieAI = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }

    // Save session id returned from backend
    if (data.sessionId) {
      sessionId = data.sessionId;
      localStorage.setItem(
        "reelix-ai-session",
        data.sessionId
      );
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ======================================
// Clear AI Session
// ======================================

export const clearAISession = () => {
  sessionId = null;

  localStorage.removeItem("reelix-ai-session");
  localStorage.removeItem("reelix-ai-chat");
};