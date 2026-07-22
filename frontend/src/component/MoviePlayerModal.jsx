import { useState, useRef, useEffect, useCallback } from "react";
import {
  FaTimes,
  FaFilm,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeDown,
  FaVolumeUp,
  FaExpand,
  FaCompress,
  FaUndo,
  FaRedo,
  FaCog,
  FaServer,
  FaSpinner,
  FaDesktop,
  FaCheck,
} from "react-icons/fa";

const MoviePlayerModal = ({ isOpen, onClose, title, videoUrl, isTrailer, movie }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Determine active media / TMDB ID
  const tmdbId = movie?._id || movie?.id;

  // Stream Sources Configuration
  const availableSources = [
    {
      id: "direct",
      name: "Direct HD Stream",
      type: "video",
      url: videoUrl || movie?.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      badge: "1080p CDN",
    },
  ];

  if (tmdbId) {
    availableSources.push(
      {
        id: "server1",
        name: "VidSrc HD Server 1",
        type: "iframe",
        url: `https://vidsrc.to/embed/movie/${tmdbId}`,
        badge: "Ultra HD",
      },
      {
        id: "server2",
        name: "AutoEmbed Server 2",
        type: "iframe",
        url: `https://player.autoembed.cc/embed/movie/${tmdbId}`,
        badge: "Fast Stream",
      },
      {
        id: "server3",
        name: "VidSrc.me Server 3",
        type: "iframe",
        url: `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
        badge: "Multi-Sub",
      }
    );
  }

  if (movie?.trailer || (isTrailer && videoUrl)) {
    const trailerUrl = movie?.trailer || videoUrl;
    availableSources.push({
      id: "trailer",
      name: "Official Trailer",
      type: "youtube",
      url: trailerUrl,
      badge: "YouTube HD",
    });
  }

  // Player State
  const [activeSourceId, setActiveSourceId] = useState(isTrailer ? "trailer" : "direct");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const currentSource = availableSources.find((s) => s.id === activeSourceId) || availableSources[0];

  // Auto-hide controls logic
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowServerMenu(false);
      }, 3500);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      // Avoid triggering when user typing in an input
      if (["input", "textarea"].includes(document.activeElement?.tagName?.toLowerCase())) return;

      if (e.code === "Space" || e.code === "KeyK") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft" || e.code === "KeyJ") {
        e.preventDefault();
        skipTime(-10);
      } else if (e.code === "ArrowRight" || e.code === "KeyL") {
        e.preventDefault();
        skipTime(10);
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        changeVolume(Math.min(1, volume + 0.1));
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        changeVolume(Math.max(0, volume - 0.1));
      } else if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      } else if (e.code === "Escape") {
        if (!isFullscreen) onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, volume, isPlaying, isFullscreen]);

  // Handle HTML5 Video Events
  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentSource.type !== "video") return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onEnded = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBufferedPercent((bufferedEnd / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("progress", onProgress);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("progress", onProgress);
    };
  }, [currentSource]);

  // Sync fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

  // Video playback helper actions
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), duration);
  };

  const handleSeekChange = (e) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const handleSeekHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setHoverPosition(e.clientX - rect.left);
    setHoverTime(pos * duration);
  };

  const changeVolume = (newVol) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      videoRef.current.muted = nextMute;
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error("Picture-in-picture error:", err);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const minutes = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      const mins = Math.floor(minutes % 60);
      return `${hours}:${mins < 10 ? "0" : ""}${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
    }
    return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  // Helper for Youtube ID
  let youtubeEmbedUrl = "";
  if (currentSource.type === "youtube") {
    let ytId = "";
    if (currentSource.url.includes("v=")) {
      ytId = currentSource.url.split("v=")[1]?.split("&")[0];
    } else if (currentSource.url.includes("youtu.be/")) {
      ytId = currentSource.url.split("youtu.be/")[1]?.split("?")[0];
    }
    youtubeEmbedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full max-w-7xl h-full sm:h-auto sm:aspect-video bg-black sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col group select-none"
      >
        {/* ================= TOP HEADER BAR ================= */}
        <div
          className={`absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 sm:p-6 flex items-center justify-between transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-lg">
              <FaFilm className="text-lg animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-xl line-clamp-1 drop-shadow-md">
                {title || movie?.name || "Movie Stream"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-300 mt-0.5">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {currentSource.badge}
                </span>
                <span>• {currentSource.name}</span>
              </div>
            </div>
          </div>

          {/* Top Controls: Server Picker & Close Button */}
          <div className="flex items-center gap-3">
            {/* Server Selector Button */}
            {availableSources.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowServerMenu(!showServerMenu);
                    setShowSpeedMenu(false);
                  }}
                  className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md transition shadow-md"
                >
                  <FaServer className="text-red-500" />
                  <span>{currentSource.name}</span>
                </button>

                {/* Server Menu Popover */}
                {showServerMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in duration-200">
                    <p className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1.5 border-b border-zinc-800">
                      Select Stream Server
                    </p>
                    <div className="mt-1 flex flex-col gap-1">
                      {availableSources.map((src) => (
                        <button
                          key={src.id}
                          onClick={() => {
                            setActiveSourceId(src.id);
                            setShowServerMenu(false);
                            setIsPlaying(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                            activeSourceId === src.id
                              ? "bg-red-600 text-white"
                              : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{src.name}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/30 border border-white/10 font-bold">
                            {src.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-zinc-900/90 hover:bg-red-600 border border-zinc-700/80 text-white flex items-center justify-center transition hover:rotate-90 duration-300 shadow-md backdrop-blur-md"
              aria-label="Close modal"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* ================= MEDIA CONTAINER ================= */}
        <div
          onClick={currentSource.type === "video" ? togglePlay : undefined}
          onDoubleClick={toggleFullscreen}
          className="relative flex-1 w-full h-full bg-black flex items-center justify-center overflow-hidden cursor-pointer"
        >
          {/* 1. Standard Custom HTML5 Video Player */}
          {currentSource.type === "video" && (
            <>
              <video
                ref={videoRef}
                src={currentSource.url}
                autoPlay
                className="w-full h-full object-contain"
              />

              {/* Buffering Spinner Overlay */}
              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 pointer-events-none">
                  <FaSpinner className="text-red-600 text-5xl animate-spin" />
                </div>
              )}

              {/* Big Center Play/Pause Indicator Overlay */}
              {!isPlaying && !isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-red-600/90 border-2 border-white/20 text-white flex items-center justify-center pl-1 shadow-2xl transform scale-100 animate-pulse">
                    <FaPlay className="text-3xl" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* 2. Full Movie Embed Stream (IFrame) */}
          {currentSource.type === "iframe" && (
            <iframe
              className="w-full h-full border-0"
              src={currentSource.url}
              title={title || "Movie Player Stream"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}

          {/* 3. YouTube Embed Stream */}
          {currentSource.type === "youtube" && (
            <iframe
              className="w-full h-full border-0"
              src={youtubeEmbedUrl}
              title={title || "Trailer Player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>

        {/* ================= CUSTOM CONTROL BAR (For Direct Video) ================= */}
        {currentSource.type === "video" && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6 transition-opacity duration-300 flex flex-col gap-3 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Timeline / Seekbar */}
            <div className="relative group/timeline w-full flex items-center h-4 cursor-pointer">
              {/* Hover Timestamp Preview Tooltip */}
              {hoverTime !== null && (
                <div
                  style={{ left: `${hoverPosition}px` }}
                  className="absolute -top-8 -translate-x-1/2 bg-zinc-900 border border-zinc-700 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none"
                >
                  {formatTime(hoverTime)}
                </div>
              )}

              {/* Progress Slider Track */}
              <div className="w-full h-1.5 group-hover/timeline:h-2.5 bg-zinc-800/80 rounded-full overflow-hidden relative transition-all duration-200">
                {/* Pre-buffered track */}
                <div
                  style={{ width: `${bufferedPercent}%` }}
                  className="absolute top-0 bottom-0 left-0 bg-white/20 rounded-full transition-all"
                ></div>
                {/* Active Progress Fill */}
                <div
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  className="absolute top-0 bottom-0 left-0 bg-red-600 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.8)]"
                ></div>
              </div>

              {/* Native Invisible Range Input for Smooth Scrubbing */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeekChange}
                onMouseMove={handleSeekHover}
                onMouseLeave={() => setHoverTime(null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>

            {/* Controls Button Row */}
            <div className="flex items-center justify-between text-white">
              {/* Left Controls Group */}
              <div className="flex items-center gap-3 sm:gap-5">
                {/* Play / Pause Toggle */}
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-lg transform hover:scale-105"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FaPause className="text-base" /> : <FaPlay className="text-base pl-0.5" />}
                </button>

                {/* Quick Rewind -10s */}
                <button
                  onClick={() => skipTime(-10)}
                  className="p-2 text-gray-300 hover:text-white transition"
                  title="Rewind 10s (Left Arrow)"
                >
                  <FaUndo className="text-sm sm:text-base" />
                </button>

                {/* Quick Forward +10s */}
                <button
                  onClick={() => skipTime(10)}
                  className="p-2 text-gray-300 hover:text-white transition"
                  title="Forward 10s (Right Arrow)"
                >
                  <FaRedo className="text-sm sm:text-base" />
                </button>

                {/* Volume & Mute Controls */}
                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-gray-300 hover:text-white transition"
                    title="Mute / Unmute (M)"
                  >
                    {isMuted || volume === 0 ? (
                      <FaVolumeMute className="text-red-500 text-lg" />
                    ) : volume < 0.5 ? (
                      <FaVolumeDown className="text-lg" />
                    ) : (
                      <FaVolumeUp className="text-lg" />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-16 sm:w-24 accent-red-600 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Time Display */}
                <div className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wider">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-gray-500 mx-1">/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right Controls Group */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Playback Speed Popover */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSpeedMenu(!showSpeedMenu);
                      setShowServerMenu(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-bold text-gray-200 border border-zinc-700 flex items-center gap-1 transition"
                  >
                    <FaCog className="text-xs" />
                    <span>{playbackSpeed}x</span>
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute right-0 bottom-10 w-32 bg-zinc-900 border border-zinc-700 rounded-xl p-1 shadow-2xl z-50 animate-in fade-in duration-200">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => changeSpeed(speed)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                            playbackSpeed === speed
                              ? "bg-red-600 text-white font-bold"
                              : "text-gray-300 hover:bg-zinc-800"
                          }`}
                        >
                          <span>{speed === 1 ? "Normal" : `${speed}x`}</span>
                          {playbackSpeed === speed && <FaCheck className="text-[10px]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Picture in Picture */}
                <button
                  onClick={togglePiP}
                  className="hidden sm:block p-2 text-gray-300 hover:text-white transition"
                  title="Picture in Picture"
                >
                  <FaDesktop className="text-base" />
                </button>

                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-gray-300 hover:text-white transition"
                  title="Toggle Fullscreen (F)"
                >
                  {isFullscreen ? (
                    <FaCompress className="text-lg" />
                  ) : (
                    <FaExpand className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePlayerModal;
