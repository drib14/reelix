import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { FaWandMagicSparkles, FaFire, FaPlay, FaSliders } from "react-icons/fa6";
import { getVibeRecommendations } from "../../redux/api/aiApi";
import { useNavigate } from "react-router-dom";

const PRESET_VIBES = [
  { label: "🌌 Cyberpunk & Dark Noir", mood: "Cyberpunk Dystopia", energy: 8, tone: "Gritty" },
  { label: "🌧️ Late-Night Mind Benders", mood: "Psychological Thriller", energy: 6, tone: "Dark" },
  { label: "⚡ High-Octane Action", mood: "Adrenaline & Explosions", energy: 10, tone: "Exciting" },
  { label: "🍿 Cozy Weekend Feel-Good", mood: "Wholesome Comfort", energy: 4, tone: "Lighthearted" },
  { label: "👺 Epic Anime & Fantasy", mood: "Mythical High Fantasy", energy: 9, tone: "Epic" },
];

const VibeFinderModal = ({ isOpen, onClose }) => {
  const [mood, setMood] = useState("Cyberpunk Dystopia");
  const [energy, setEnergy] = useState(7);
  const [tone, setTone] = useState("Dark & Suspenseful");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setMood(preset.mood);
    setEnergy(preset.energy);
    setTone(preset.tone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await getVibeRecommendations({
        mood,
        energy,
        tone,
        prompt: customPrompt,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate vibe recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayMedia = (media) => {
    onClose();
    const targetUrl = media.media_type === "tv" ? `/tv/${media.id}` : `/movie/${media.id}`;
    if (!userInfo) {
      toast.info("Please sign in to stream movies and series on Reelix.");
      navigate(`/login?redirect=${encodeURIComponent(targetUrl)}`);
      return;
    }
    navigate(targetUrl);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-hidden">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col text-white my-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <FaWandMagicSparkles className="text-xl animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                AI Vibe & Mood Curator
              </h2>
              <p className="text-xs text-slate-400">
                Find exactly what to watch based on how you feel right now
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Preset Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Vibe Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_VIBES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    mood === preset.mood
                      ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/20"
                      : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Energy Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Energy Level: <span className="text-amber-400 font-bold">{energy} / 10</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {energy <= 3 ? "Chill & Relaxed" : energy <= 7 ? "Balanced Thrill" : "Maximum Intensity"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Custom Prompt Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Describe your exact vibe (optional)
              </label>
              <textarea
                rows="2"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. A dark rainy neo-noir thriller with plot twists and great music..."
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/80 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Vibe Watchlist...</span>
                </>
              ) : (
                <>
                  <FaWandMagicSparkles className="text-lg" />
                  <span>Curate Vibe Watchlist</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-950/60 border border-red-800/60 text-red-300 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Results Gallery */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-slate-800 animate-fadeIn">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <FaWandMagicSparkles className="text-amber-300" />
                  {result.vibeTitle}
                </h3>
                <p className="text-sm text-slate-300 mt-1">{result.vibeSummary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.movies &&
                  result.movies.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handlePlayMedia(item)}
                      className="group flex gap-3 p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 rounded-xl cursor-pointer transition"
                    >
                      <img
                        src={item.poster || item.image || "https://via.placeholder.com/150"}
                        alt={item.title || item.name}
                        className="w-16 h-24 object-cover rounded-lg shadow-md group-hover:scale-105 transition"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition line-clamp-1">
                              {item.title || item.name}
                            </h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/30 shrink-0">
                              {item.media_type === "tv" ? "TV Show" : "Movie"}
                            </span>
                          </div>
                          <p className="text-xs text-amber-300/90 mt-1 line-clamp-2 italic">
                            "{item.aiReason || "Matches your requested vibe energy."}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                          <span>{item.year || "N/A"} • ⭐ {item.rating || "N/A"}</span>
                          <span className="flex items-center gap-1 text-amber-400 font-semibold group-hover:translate-x-1 transition">
                            <FaPlay className="text-[10px]" /> Stream Now
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VibeFinderModal;
