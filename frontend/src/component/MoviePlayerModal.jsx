import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  FaStepForward,
  FaStepBackward,
  FaTv,
  FaListOl,
  FaSearch,
} from "react-icons/fa";
import { useGetTvSeasonDetailsQuery } from "../redux/api/movies";

const MoviePlayerModal = ({
  isOpen,
  onClose,
  title,
  videoUrl,
  isTrailer,
  movie,
  season = 1,
  episode = 1,
  onSelectEpisode,
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const tmdbId = movie?._id || movie?.id;
  const isTvSeries = movie?.media_type === "tv" || !!movie?.number_of_seasons || season > 1 || episode > 1;

  // Active Season & Episode states for internal player tracking
  const [currentSeason, setCurrentSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);

  // Sync internal season/episode state with incoming props
  useEffect(() => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  }, [season, episode]);

  // Drawer States
  const [showEpisodesDrawer, setShowEpisodesDrawer] = useState(false);
  const [drawerSeason, setDrawerSeason] = useState(currentSeason);
  const [drawerSearch, setDrawerSearch] = useState("");

  // Sync drawer season when current season changes
  useEffect(() => {
    setDrawerSeason(currentSeason);
  }, [currentSeason]);

  // Fetch Season details dynamically for in-player episode drawer & header info
  const { data: seasonDetailsData, isLoading: loadingDrawerSeason } = useGetTvSeasonDetailsQuery(
    { id: tmdbId, season: drawerSeason },
    { skip: !isOpen || !isTvSeries || !tmdbId }
  );

  // Available Seasons list for drawer select
  const availableSeasonsList = useMemo(() => {
    if (movie?.seasons && movie.seasons.length > 0) {
      const validSeasons = movie.seasons.filter((s) => s.season_number > 0);
      if (validSeasons.length > 0) {
        return validSeasons.map((s) => {
          const sName = s.name || "";
          const hasCustomName = sName && !sName.toLowerCase().startsWith("season ") && sName !== `Season ${s.season_number}`;
          return {
            seasonNumber: s.season_number,
            name: sName,
            displayName: hasCustomName ? `Season ${s.season_number}: ${sName}` : (sName || `Season ${s.season_number}`),
            episodeCount: s.episode_count || 24,
          };
        });
      }
    }
    const count = movie?.numberOfSeasons || 1;
    return Array.from({ length: count }, (_, i) => ({
      seasonNumber: i + 1,
      displayName: `Season ${i + 1}`,
      episodeCount: 24,
    }));
  }, [movie]);

  // Active drawer episodes
  const drawerEpisodesList = useMemo(() => {
    if (seasonDetailsData?.episodes && seasonDetailsData.episodes.length > 0) {
      return seasonDetailsData.episodes.map((ep) => ({
        episodeNumber: ep.episodeNumber,
        title: ep.title ? `EP ${ep.episodeNumber}: ${ep.title}` : `Episode ${ep.episodeNumber}`,
        rawTitle: ep.title || `Episode ${ep.episodeNumber}`,
        overview: ep.overview || `Episode ${ep.episodeNumber} of Season ${drawerSeason}.`,
        still: ep.still || "",
        runtime: ep.runtime || 24,
      }));
    }
    const count = availableSeasonsList.find((s) => s.seasonNumber === drawerSeason)?.episodeCount || 24;
    const list = [];
    for (let ep = 1; ep <= count; ep++) {
      list.push({
        episodeNumber: ep,
        title: `Episode ${ep}`,
        rawTitle: `Episode ${ep}`,
        overview: `Episode ${ep} of Season ${drawerSeason}. Stream in 1080p Ultra HD across all available servers.`,
        still: "",
        runtime: 24,
      });
    }
    return list;
  }, [seasonDetailsData, drawerSeason, availableSeasonsList]);

  // Filter drawer episodes by search query
  const filteredDrawerEpisodes = useMemo(() => {
    if (!drawerSearch.trim()) return drawerEpisodesList;
    const q = drawerSearch.trim().toLowerCase();
    return drawerEpisodesList.filter(
      (ep) => String(ep.episodeNumber).includes(q) || ep.title.toLowerCase().includes(q)
    );
  }, [drawerEpisodesList, drawerSearch]);

  // Current playing episode info (for header title display)
  const activeSeasonInfo = availableSeasonsList.find((s) => s.seasonNumber === currentSeason);

  // Build 8 HD Streaming Server Sources
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
    if (isTvSeries) {
      availableSources.push(
        {
          id: "server1",
          name: "VidSrc PRO HD",
          type: "iframe",
          url: `https://vidsrc.to/embed/tv/${tmdbId}/${currentSeason}/${currentEpisode}`,
          badge: "4K / 1080p",
        },
        {
          id: "server2",
          name: "AutoEmbed Ultra",
          type: "iframe",
          url: `https://player.autoembed.cc/embed/tv/${tmdbId}/${currentSeason}/${currentEpisode}`,
          badge: "Fast Stream",
        },
        {
          id: "server3",
          name: "VidSrc.me",
          type: "iframe",
          url: `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${currentSeason}&episode=${currentEpisode}`,
          badge: "Multi-Sub",
        },
        {
          id: "server4",
          name: "VidSrc.icu",
          type: "iframe",
          url: `https://vidsrc.icu/embed/tv/${tmdbId}/${currentSeason}/${currentEpisode}`,
          badge: "Dual Audio",
        },
        {
          id: "server5",
          name: "2Embed Premium",
          type: "iframe",
          url: `https://www.2embed.cc/embedtv/${tmdbId}&s=${currentSeason}&e=${currentEpisode}`,
          badge: "Global Mirror",
        },
        {
          id: "server6",
          name: "EmbedSu Global",
          type: "iframe",
          url: `https://embed.su/embed/tv/${tmdbId}/${currentSeason}/${currentEpisode}`,
          badge: "Fast Multi-Lang",
        },
        {
          id: "server7",
          name: "VidSrc.cc",
          type: "iframe",
          url: `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${currentSeason}/${currentEpisode}`,
          badge: "Ultra Mirror",
        },
        {
          id: "server8",
          name: "MultiEmbed HD",
          type: "iframe",
          url: `https://api.multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${currentSeason}&e=${currentEpisode}`,
          badge: "Worldwide Server",
        }
      );
    } else {
      availableSources.push(
        {
          id: "server1",
          name: "VidSrc PRO HD",
          type: "iframe",
          url: `https://vidsrc.to/embed/movie/${tmdbId}`,
          badge: "4K / 1080p",
        },
        {
          id: "server2",
          name: "AutoEmbed Ultra",
          type: "iframe",
          url: `https://player.autoembed.cc/embed/movie/${tmdbId}`,
          badge: "Fast Stream",
        },
        {
          id: "server3",
          name: "VidSrc.me",
          type: "iframe",
          url: `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
          badge: "Multi-Sub",
        },
        {
          id: "server4",
          name: "VidSrc.icu",
          type: "iframe",
          url: `https://vidsrc.icu/embed/movie/${tmdbId}`,
          badge: "Dual Audio",
        },
        {
          id: "server5",
          name: "2Embed Premium",
          type: "iframe",
          url: `https://www.2embed.cc/embedmovie/${tmdbId}`,
          badge: "Global Mirror",
        },
        {
          id: "server6",
          name: "EmbedSu Global",
          type: "iframe",
          url: `https://embed.su/embed/movie/${tmdbId}`,
          badge: "Fast Multi-Lang",
        },
        {
          id: "server7",
          name: "VidSrc.cc",
          type: "iframe",
          url: `https://vidsrc.cc/v2/embed/movie/${tmdbId}`,
          badge: "Ultra Mirror",
        },
        {
          id: "server8",
          name: "MultiEmbed HD",
          type: "iframe",
          url: `https://api.multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
          badge: "Worldwide Server",
        }
      );
    }
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

  const defaultSource = isTrailer ? "trailer" : tmdbId ? "server1" : "direct";
  const [activeSourceId, setActiveSourceId] = useState(defaultSource);

  useEffect(() => {
    setActiveSourceId(isTrailer ? "trailer" : tmdbId ? "server1" : "direct");
  }, [tmdbId, currentSeason, currentEpisode, isTrailer]);

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

  // Episode Selection Handler inside Player Modal
  const handleEpisodeSelect = (sNum, epNum) => {
    setCurrentSeason(sNum);
    setCurrentEpisode(epNum);
    setShowEpisodesDrawer(false);
    if (onSelectEpisode) {
      onSelectEpisode(sNum, epNum);
    }
  };

  // Auto-save watched progress timestamp to localStorage
  useEffect(() => {
    if (currentTime > 5 && tmdbId) {
      const storageKey = `reelix_progress_${tmdbId}_s${currentSeason}_e${currentEpisode}`;
      localStorage.setItem(storageKey, JSON.stringify({
        time: currentTime,
        duration,
        percent: duration ? (currentTime / duration) * 100 : 0,
        updatedAt: Date.now(),
      }));
    }
  }, [currentTime, tmdbId, currentSeason, currentEpisode, duration]);

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
      } else if (e.code === "KeyN" && isTvSeries && onSelectEpisode) {
        e.preventDefault();
        handleEpisodeSelect(currentSeason, currentEpisode + 1);
      } else if (e.code === "Escape") {
        if (showEpisodesDrawer) {
          setShowEpisodesDrawer(false);
        } else if (!isFullscreen) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, volume, isPlaying, isFullscreen, isTvSeries, currentSeason, currentEpisode, showEpisodesDrawer]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentSource.type !== "video") return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onEnded = () => {
      setIsPlaying(false);
      if (isTvSeries && onSelectEpisode) {
        handleEpisodeSelect(currentSeason, currentEpisode + 1);
      }
    };
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
  }, [currentSource, isTvSeries, currentSeason, currentEpisode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

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

  const togglePiP = async () => {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current.requestPictureInPicture) {
        await videoRef.current.requestPictureInPicture();
      }
    }
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
          className={`absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 sm:p-6 flex items-center justify-between transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3 pr-2 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-lg flex-shrink-0">
              {isTvSeries ? <FaTv className="text-lg" /> : <FaFilm className="text-lg" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold text-sm sm:text-lg line-clamp-1 drop-shadow-md flex items-center gap-1.5">
                <span className="truncate">{movie?.name || title || "Streaming"}</span>
                {isTvSeries && (
                  <span className="text-red-400 text-xs font-extrabold bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded-md whitespace-nowrap">
                    {activeSeasonInfo?.displayName ? `${activeSeasonInfo.displayName} • EP ${currentEpisode}` : `S${currentSeason}:E${currentEpisode}`}
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-300 mt-0.5 truncate">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {currentSource.badge}
                </span>
                <span className="truncate">• {currentSource.name}</span>
              </div>
            </div>
          </div>

          {/* Controls Right Group */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* TV Series Episode Drawer Button */}
            {isTvSeries && (
              <button
                onClick={() => setShowEpisodesDrawer(!showEpisodesDrawer)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition backdrop-blur-md shadow-md ${
                  showEpisodesDrawer
                    ? "bg-red-600 text-white border-red-500"
                    : "bg-zinc-900/90 text-gray-200 border-zinc-700/80 hover:bg-zinc-800 hover:text-white"
                }`}
                title="Episodes & Seasons Selector"
              >
                <FaListOl className="text-red-400 text-sm" />
                <span className="hidden sm:inline">Episodes & Seasons</span>
              </button>
            )}

            {/* TV Series Next/Prev Episode Quick Controls */}
            {isTvSeries && onSelectEpisode && (
              <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 backdrop-blur-md">
                <button
                  disabled={currentEpisode <= 1}
                  onClick={() => handleEpisodeSelect(currentSeason, Math.max(1, currentEpisode - 1))}
                  className="px-2.5 py-1.5 text-xs text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:text-gray-300 flex items-center gap-1 rounded-lg hover:bg-zinc-800 transition"
                  title="Previous Episode"
                >
                  <FaStepBackward className="text-[10px]" />
                  <span className="hidden md:inline">Prev</span>
                </button>
                <button
                  onClick={() => handleEpisodeSelect(currentSeason, currentEpisode + 1)}
                  className="px-2.5 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1 rounded-lg transition shadow"
                  title="Next Episode"
                >
                  <span className="hidden md:inline">Next Ep</span>
                  <FaStepForward className="text-[10px]" />
                </button>
              </div>
            )}

            {/* Server Selector Menu Button */}
            {availableSources.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowServerMenu(!showServerMenu);
                    setShowSpeedMenu(false);
                  }}
                  className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl flex items-center gap-2 backdrop-blur-md transition shadow-md"
                >
                  <FaServer className="text-red-500" />
                  <span className="hidden sm:inline">{currentSource.name}</span>
                  <span className="sm:hidden font-bold">{currentSource.id}</span>
                </button>

                {/* Server Menu Popover */}
                {showServerMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in duration-200">
                    <p className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1.5 border-b border-zinc-800">
                      Select Server ({availableSources.length} Available)
                    </p>
                    <div className="mt-1 flex flex-col gap-1 max-h-60 overflow-y-auto">
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
                              ? "bg-red-600 text-white font-bold"
                              : "text-gray-300 hover:bg-zinc-800 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span>{src.name}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/40 border border-white/10 font-bold whitespace-nowrap">
                            {src.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-zinc-900/90 hover:bg-red-600 border border-zinc-700/80 text-white flex items-center justify-center transition hover:rotate-90 duration-300 shadow-md backdrop-blur-md"
              aria-label="Close player"
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
          {/* 1. Direct HTML5 Video */}
          {currentSource.type === "video" && (
            <>
              <video
                ref={videoRef}
                src={currentSource.url}
                autoPlay
                className="w-full h-full object-contain"
              />

              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 pointer-events-none">
                  <FaSpinner className="text-red-600 text-5xl animate-spin" />
                </div>
              )}

              {!isPlaying && !isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-red-600/90 border-2 border-white/20 text-white flex items-center justify-center pl-1 shadow-2xl transform scale-100 animate-pulse">
                    <FaPlay className="text-3xl" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* 2. Full Movie / TV Embed Stream (IFrame) */}
          {currentSource.type === "iframe" && (
            <iframe
              className="w-full h-full border-0"
              src={currentSource.url}
              title={title || "Stream Player"}
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

          {/* ================= IN-PLAYER EPISODES & SEASONS DRAWER ================= */}
          {showEpisodesDrawer && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-zinc-950/95 border-l border-zinc-800/80 shadow-2xl backdrop-blur-2xl flex flex-col animate-in slide-in-from-right duration-300"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
                <div className="flex items-center gap-2">
                  <FaListOl className="text-red-600 text-base" />
                  <div>
                    <h4 className="text-white font-extrabold text-sm sm:text-base">Episodes & Seasons</h4>
                    <p className="text-[11px] text-gray-400 truncate max-w-[240px]">{movie?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEpisodesDrawer(false)}
                  className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {/* Season Selector & Search Filter */}
              <div className="p-4 border-b border-zinc-800/80 flex flex-col gap-3 bg-zinc-900/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 whitespace-nowrap">Season:</span>
                  <select
                    value={drawerSeason}
                    onChange={(e) => setDrawerSeason(Number(e.target.value))}
                    className="flex-1 bg-zinc-900 text-white font-bold text-xs sm:text-sm px-3 py-2 rounded-xl outline-none border border-zinc-700 cursor-pointer"
                  >
                    {availableSeasonsList.map((s) => (
                      <option key={s.seasonNumber} value={s.seasonNumber}>
                        {s.displayName} ({s.episodeCount} Ep)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                  <input
                    type="text"
                    placeholder="Search episode title or #..."
                    value={drawerSearch}
                    onChange={(e) => setDrawerSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Episodes Scrollable List */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 no-scrollbar">
                {loadingDrawerSeason ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <FaSpinner className="text-red-600 text-3xl animate-spin mb-2" />
                    <p className="text-xs text-gray-400">Loading episodes...</p>
                  </div>
                ) : filteredDrawerEpisodes.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 text-xs">
                    No episodes found matching search.
                  </div>
                ) : (
                  filteredDrawerEpisodes.map((ep) => {
                    const isSelected = drawerSeason === currentSeason && ep.episodeNumber === currentEpisode;

                    return (
                      <div
                        key={ep.episodeNumber}
                        onClick={() => handleEpisodeSelect(drawerSeason, ep.episodeNumber)}
                        className={`group rounded-xl p-3 border transition cursor-pointer flex gap-3 ${
                          isSelected
                            ? "bg-red-950/40 border-red-600 ring-1 ring-red-600"
                            : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80"
                        }`}
                      >
                        {ep.still ? (
                          <div className="w-24 aspect-video rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0 relative">
                            <img src={ep.still} alt={ep.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <FaPlay className="text-white text-xs" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-red-500 text-xs flex-shrink-0">
                            EP {ep.episodeNumber}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-red-500">
                              EP {ep.episodeNumber}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded animate-pulse">
                                PLAYING
                              </span>
                            )}
                          </div>
                          <h5 className="text-white font-bold text-xs truncate group-hover:text-red-400 transition">
                            {ep.rawTitle || ep.title}
                          </h5>
                          <p className="text-gray-400 text-[11px] line-clamp-2 mt-0.5 leading-snug">
                            {ep.overview}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= CUSTOM CONTROL BAR (For Direct Video) ================= */}
        {currentSource.type === "video" && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6 transition-opacity duration-300 flex flex-col gap-3 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Timeline */}
            <div className="relative group/timeline w-full flex items-center h-4 cursor-pointer">
              {hoverTime !== null && (
                <div
                  style={{ left: `${hoverPosition}px` }}
                  className="absolute -top-8 -translate-x-1/2 bg-zinc-900 border border-zinc-700 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none"
                >
                  {formatTime(hoverTime)}
                </div>
              )}

              <div className="w-full h-1.5 group-hover/timeline:h-2.5 bg-zinc-800/80 rounded-full overflow-hidden relative transition-all duration-200">
                <div
                  style={{ width: `${bufferedPercent}%` }}
                  className="absolute top-0 bottom-0 left-0 bg-white/20 rounded-full transition-all"
                ></div>
                <div
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  className="absolute top-0 bottom-0 left-0 bg-red-600 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.8)]"
                ></div>
              </div>

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
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-lg transform hover:scale-105"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FaPause className="text-base" /> : <FaPlay className="text-base pl-0.5" />}
                </button>

                <button
                  onClick={() => skipTime(-10)}
                  className="p-2 text-gray-300 hover:text-white transition"
                  title="Rewind 10s"
                >
                  <FaUndo className="text-sm sm:text-base" />
                </button>

                <button
                  onClick={() => skipTime(10)}
                  className="p-2 text-gray-300 hover:text-white transition"
                  title="Forward 10s"
                >
                  <FaRedo className="text-sm sm:text-base" />
                </button>

                <div className="flex items-center gap-2 group/volume">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-gray-300 hover:text-white transition"
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

                <div className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wider">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-gray-500 mx-1">/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Speed & Settings Menu */}
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
                    <div className="absolute right-0 bottom-10 w-36 bg-zinc-900 border border-zinc-700 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in duration-200 flex flex-col gap-1">
                      <p className="text-[10px] font-bold text-gray-400 px-2 py-1 uppercase border-b border-zinc-800">
                        Playback Speed
                      </p>

                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => changeSpeed(speed)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
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

                <button
                  onClick={togglePiP}
                  className="hidden sm:block p-2 text-gray-300 hover:text-white transition"
                  title="Picture in Picture"
                >
                  <FaDesktop className="text-base" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-gray-300 hover:text-white transition"
                  title="Toggle Fullscreen"
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
