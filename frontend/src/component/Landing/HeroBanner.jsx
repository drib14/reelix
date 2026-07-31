const HeroBanner = ({ movie }) => {
  if (!movie) return null;

  return (
    <section
      className="relative h-[65vh] w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${movie.backdrop})`,
      }}
    >
      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/75"></div>

      {/* Left Gradient */}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

      {/* Hero Content */}

      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-6">

        <div className="max-w-3xl">

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight text-white tracking-tight">
            Discover Catalog
          </h1>

          <p className="mt-4 sm:mt-6 text-gray-300 text-sm sm:text-lg md:text-xl leading-relaxed max-w-2xl">
            Explore thousands of trending movies, TV series, anime, and live streams across global providers. Build your personal watchlist on Reelix.
          </p>

        </div>

      </div>

      {/* Bottom Gradient */}

      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

    </section>
  );
};

export default HeroBanner;