import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="relative h-[88vh] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6 pt-16">

        <h1 className="text-white text-5xl md:text-7xl font-black leading-tight max-w-5xl">
          Unlimited Movies,
          <br />
          TV Shows and More
        </h1>

        <p className="text-white text-2xl mt-6 font-medium">
          Watch anywhere. Discover anytime.
        </p>

        <p className="text-gray-300 mt-6 text-lg max-w-2xl">
          Explore thousands of movies powered by TMDB. Search your favourites,
          discover trending titles, and build your own personal watchlist.
        </p>

        {/* Action Buttons */}

        <div className="flex flex-col md:flex-row gap-5 mt-10">

          <Link
            to="/movies"
            className="px-10 py-4 bg-red-600 hover:bg-red-700 transition rounded-lg text-white text-xl font-semibold shadow-lg"
          >
            🎬 Browse Movies
          </Link>

          <Link
            to="/watchlist"
            className="px-10 py-4 bg-gray-800 hover:bg-gray-700 transition rounded-lg text-white text-xl font-semibold border border-gray-600"
          >
            ❤️ My Watchlist
          </Link>

        </div>

      </div>

      {/* Bottom Gradient */}

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>

    </section>
  );
};

export default Hero;