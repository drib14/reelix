import { useState } from "react";
import { FaTimes, FaFilm, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const MoviePlayerModal = ({ isOpen, onClose, title, videoUrl, isTrailer }) => {
  const [muted, setMuted] = useState(false);

  if (!isOpen || !videoUrl) return null;

  // Detect if YouTube embed
  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  let youtubeId = "";
  if (isYouTube) {
    if (videoUrl.includes("v=")) {
      youtubeId = videoUrl.split("v=")[1]?.split("&")[0];
    } else if (videoUrl.includes("youtu.be/")) {
      youtubeId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-zinc-900/90 border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <FaFilm className="text-sm" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg line-clamp-1">
                {title || "Movie Player"}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {isTrailer ? "Official Trailer • HD" : "Full Movie Stream • 1080p Ultra HD"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-red-600 text-white flex items-center justify-center transition hover:rotate-90 duration-300"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {isYouTube ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={title || "Movie Player"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              muted={muted}
              controlsList="nodownload"
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video playback.
            </video>
          )}
        </div>

        {/* Footer Notice Bar */}
        <div className="bg-zinc-900/60 border-t border-zinc-800 px-6 py-3 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-emerald-400 font-semibold">Live High-Speed Stream Active ($0 Cost Cloud CDN)</span>
          </span>
          <span className="hidden sm:inline">Press ESC to exit player</span>
        </div>

      </div>
    </div>
  );
};

export default MoviePlayerModal;
