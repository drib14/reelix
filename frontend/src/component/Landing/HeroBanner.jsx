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

          <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
            Discover Movies
          </h1>

          <p className="mt-8 text-gray-300 text-xl leading-9">
            Explore thousands of trending, popular, top-rated and upcoming
            movies. Search your favourites, discover hidden gems, and build
            your own personal watchlist with MovieFlix.
          </p>

        </div>

      </div>

      {/* Bottom Gradient */}

      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

    </section>
  );
};

export default HeroBanner;