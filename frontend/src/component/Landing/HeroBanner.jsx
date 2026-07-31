import Tilt3DCard from "../Tilt3DCard";

const HeroBanner = ({ movie }) => {
  if (!movie) return null;

  return (
    <section
      className="relative h-[65vh] w-full bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${movie.backdrop})`,
      }}
    >
      {/* Dark & Gradient Overlays */}
      <div className="absolute inset-0 bg-black/75"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-6">
        <Tilt3DCard maxTilt={6} scale={1.01} className="max-w-3xl">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/40 backdrop-blur-md border border-white/10 shadow-2xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight text-white tracking-tight">
              Discover Catalog
            </h1>
            <p className="mt-4 text-gray-300 text-sm sm:text-lg leading-relaxed max-w-2xl">
              Explore thousands of trending movies, TV series, anime, and live streams across global providers. Build your personal watchlist on Reelix.
            </p>
          </div>
        </Tilt3DCard>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
    </section>
  );
};

export default HeroBanner;