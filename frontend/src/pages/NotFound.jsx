import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaPlay, FaRedo, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import SEO from "../component/SEO";

// Fun cinema/movie quotes for 404
const MOVIE_QUOTES = [
  { quote: "Houston, we have a 404 problem.", movie: "Apollo 13 (1995)" },
  { quote: "This is not the page you're looking for.", movie: "Star Wars (1977)" },
  { quote: "You're gonna need a bigger URL.", movie: "Jaws (1975)" },
  { quote: "Frankly, my dear, this page doesn't exist.", movie: "Gone with the Wind (1939)" },
  { quote: "Keep the change, ya filthy 404.", movie: "Home Alone (1990)" },
  { quote: "There's no place like /home.", movie: "The Wizard of Oz (1939)" },
];

const NotFound = () => {
  const [selectedQuote, setSelectedQuote] = useState(MOVIE_QUOTES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game States
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("reelix_404_highscore")) || 0;
  });
  const [gameOver, setGameOver] = useState(false);

  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  // Game variables
  const bucketRef = useRef({ x: 150, y: 170, width: 50, height: 40 });
  const popcornsRef = useRef([]);
  const keysRef = useRef({});
  const lastSpawnRef = useRef(0);

  // Pick a random quote on mount
  useEffect(() => {
    const rand = MOVIE_QUOTES[Math.floor(Math.random() * MOVIE_QUOTES.length)];
    setSelectedQuote(rand);
  }, []);

  // Web Audio synth for retro game sound effects
  const playSound = (freq, type = "sine", duration = 0.1) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context blocked or unsupported", e);
    }
  };

  // Keyboard listeners for game
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Main Canvas Game Loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const updateGame = () => {
      // 1. Move Bucket
      const speed = 6;
      const bucket = bucketRef.current;
      if (keysRef.current["ArrowLeft"] || keysRef.current["KeyA"]) {
        bucket.x = Math.max(0, bucket.x - speed);
      }
      if (keysRef.current["ArrowRight"] || keysRef.current["KeyD"]) {
        bucket.x = Math.min(canvas.width - bucket.width, bucket.x + speed);
      }

      // 2. Spawn Popcorn
      const now = Date.now();
      if (now - lastSpawnRef.current > 900) {
        popcornsRef.current.push({
          x: Math.random() * (canvas.width - 20) + 10,
          y: -10,
          radius: 8,
          speed: Math.random() * 2 + 2 + score * 0.1, // get faster as score increases
        });
        lastSpawnRef.current = now;
      }

      // 3. Update Popcorns
      const popcorns = popcornsRef.current;
      for (let i = popcorns.length - 1; i >= 0; i--) {
        const p = popcorns[i];
        p.y += p.speed;

        // Collision Check (bucket catch)
        if (
          p.y + p.radius >= bucket.y &&
          p.x >= bucket.x &&
          p.x <= bucket.x + bucket.width &&
          p.y <= bucket.y + bucket.height
        ) {
          popcorns.splice(i, 1);
          setScore((s) => {
            const next = s + 1;
            if (next > highScore) {
              setHighScore(next);
              localStorage.setItem("reelix_404_highscore", next.toString());
            }
            return next;
          });
          playSound(600 + Math.random() * 200, "triangle", 0.08);
          continue;
        }

        // Out of Bounds Check (Game Over)
        if (p.y > canvas.height) {
          popcorns.splice(i, 1);
          setGameOver(true);
          playSound(150, "sawtooth", 0.4);
        }
      }
    };

    const drawGame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid / Stars Background
      ctx.strokeStyle = "rgba(229, 9, 20, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Bucket (Reelix style bucket)
      const bucket = bucketRef.current;
      // Shadow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(229, 9, 20, 0.4)";
      // Bucket fill (gradient)
      const grad = ctx.createLinearGradient(bucket.x, bucket.y, bucket.x + bucket.width, bucket.y);
      grad.addColorStop(0, "#e50914");
      grad.addColorStop(1, "#b80710");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(bucket.x, bucket.y, bucket.width, bucket.height, [4, 4, 12, 12]);
      ctx.fill();

      // Bucket Stripes
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fillRect(bucket.x + 10, bucket.y, 4, bucket.height);
      ctx.fillRect(bucket.x + 23, bucket.y, 4, bucket.height);
      ctx.fillRect(bucket.x + 36, bucket.y, 4, bucket.height);

      // Draw Popcorns
      ctx.fillStyle = "#fef08a"; // warm yellow popcorns
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 10;
      popcornsRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        // Inner detail
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x - 2, p.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fef08a";
      });

      ctx.shadowBlur = 0; // reset shadow
    };

    const loop = () => {
      updateGame();
      drawGame();
      if (!gameOver) {
        gameLoopRef.current = requestAnimationFrame(loop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, score, highScore, soundEnabled]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    popcornsRef.current = [];
    bucketRef.current.x = 150;
    playSound(440, "sine", 0.1);
    setTimeout(() => playSound(554, "sine", 0.1), 100);
    setTimeout(() => playSound(659, "sine", 0.15), 200);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden select-none">
      <SEO title="Page Not Found (404) — Reelix" />

      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-4xl z-10 flex flex-col items-center">
        {/* Glowing Projector Logo */}
        <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative group">
          <div className="absolute inset-0 bg-red-600/10 rounded-3xl blur-md opacity-75 animate-pulse"></div>
          <svg
            className="w-12 h-12 text-red-600 animate-pulse relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 20.25h12m-7.5-3v3m3.75-3v3m-12-6.75h16.5a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6.75v5.25a1.5 1.5 0 001.5 1.5z"
            />
          </svg>
        </div>

        {/* 404 Title */}
        <h1 className="text-7xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-800 drop-shadow-[0_10px_20px_rgba(229,9,20,0.3)] select-none">
          404
        </h1>

        {/* Movie Quote Display */}
        <div className="mt-4 px-6 py-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md max-w-xl transition-all duration-500">
          <p className="text-white text-base sm:text-lg font-bold italic">
            "{selectedQuote.quote}"
          </p>
          <p className="text-red-500 text-xs font-black uppercase tracking-wider mt-1.5">
            — {selectedQuote.movie}
          </p>
        </div>

        {/* ================= INTERACTIVE POPCORN GAME CARD ================= */}
        <div className="mt-8 w-full max-w-md bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Sound Toggle Button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white transition text-sm p-2 bg-zinc-950/60 rounded-lg border border-zinc-800"
            title="Toggle game sound"
          >
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>

          {!gameStarted ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <span className="text-4xl mb-2">🍿</span>
              <h3 className="text-white font-black text-sm uppercase tracking-wider">
                Popcorn Catch Mini-Game
              </h3>
              <p className="text-gray-400 text-xs mt-1.5 max-w-xs leading-relaxed">
                Catch the falling popcorn kernels with your Reelix bucket!
              </p>
              <p className="text-[10px] text-gray-500 mt-1">
                Controls: Use A / D keys or Left / Right Arrows
              </p>

              <button
                onClick={startGame}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-red-600/30 flex items-center gap-2 transform active:scale-95"
              >
                <FaPlay className="text-[10px]" />
                <span>START GAME</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Score Header */}
              <div className="w-full flex items-center justify-between text-xs font-bold text-gray-400 mb-3 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  <span>SCORE: <strong className="text-white">{score}</strong></span>
                </span>
                <span>HI-SCORE: <strong className="text-white">{highScore}</strong></span>
              </div>

              {/* Game Viewport Canvas */}
              <div className="relative border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={220}
                  className="block w-full max-w-[340px]"
                />

                {/* Game Over Screen Overlay */}
                {gameOver && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                    <span className="text-3xl mb-1">💀</span>
                    <h4 className="text-red-500 font-black text-sm uppercase tracking-wider">
                      Game Over
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">
                      You scored <strong className="text-white">{score}</strong> popcorns!
                    </p>

                    <button
                      onClick={startGame}
                      className="mt-4 bg-zinc-800 hover:bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-700/80 hover:border-red-500 transition flex items-center gap-2"
                    >
                      <FaRedo className="text-[10px]" />
                      <span>TRY AGAIN</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Navigation Redirect Controls */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="bg-zinc-900/90 hover:bg-red-600 hover:text-white border border-zinc-800 hover:border-red-500 transition-all duration-300 px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-300 flex items-center gap-2 shadow-xl"
          >
            <FaHome className="text-sm" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-300 flex items-center gap-2"
          >
            <FaArrowLeft className="text-xs" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;