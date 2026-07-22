import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[88vh] sm:min-h-[92vh] flex items-center justify-center bg-cover bg-center pt-24 pb-16 overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1920&auto=format&fit=crop')",
      }}
    >
      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-[#0d0d0e]/80 to-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/90"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-500/30 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 text-xs sm:text-sm text-red-400 font-semibold tracking-wide uppercase shadow-lg shadow-red-950/50">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>Unlimited Streaming & AI Recommendations</span>
        </div>

        {/* Title */}
        <h1 className="text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
          Stream Beyond <br className="hidden sm:inline" />
          <span className="text-gradient-red">Imagination</span>
        </h1>

        {/* Tagline */}
        <p className="text-gray-200 text-lg sm:text-2xl font-medium max-w-2xl leading-relaxed mb-8">
          Explore thousands of blockbuster movies, hidden gems, and AI-curated picks instantly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/movies"
            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 transition duration-300 rounded-xl text-white text-base sm:text-lg font-bold shadow-xl shadow-red-600/30 hover:shadow-red-600/50 flex items-center justify-center gap-2 group"
          >
            <span>🎬 Explore Movies</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/watchlist"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 transition duration-300 rounded-xl text-white text-base sm:text-lg font-bold backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <span>❤️ My Watchlist</span>
          </Link>
        </div>

        {/* Stats / Features Row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-12 mt-12 sm:mt-16 pt-8 border-t border-zinc-800/80 max-w-2xl w-full text-center">
          <div>
            <p className="text-xl sm:text-3xl font-extrabold text-white">10K+</p>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">Movies & Shows</p>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-extrabold text-white">4K</p>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">Ultra HD Quality</p>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-extrabold text-white">AI Smart</p>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">Movie Assistant</p>
          </div>
        </div>

      </div>

      {/* Bottom Vignette Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0d0d0e] to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;