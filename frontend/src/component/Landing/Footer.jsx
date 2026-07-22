import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="bg-[#0b0b0b] border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">

        {/* Top */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <Logo size="lg" className="mb-4" />

            <p className="text-gray-400 mt-4 leading-7">
              A Netflix-inspired movie streaming platform built using
              React, Redux Toolkit, Node.js, Express, MongoDB and TMDB API.
            </p>
          </div>

          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Browse
            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <Link to="/" className="hover:text-red-500 transition">
                Home
              </Link>

              <Link to="/" className="hover:text-red-500 transition">
                Trending
              </Link>

              <Link to="/" className="hover:text-red-500 transition">
                Popular
              </Link>

              <Link to="/" className="hover:text-red-500 transition">
                Top Rated
              </Link>

              <Link to="/" className="hover:text-red-500 transition">
                Upcoming
              </Link>

            </div>
          </div>

          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Account
            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <Link
                to="/watchlist"
                className="hover:text-red-500 transition"
              >
                Watchlist
              </Link>

              <Link
                to="/login"
                className="hover:text-red-500 transition"
              >
                Sign In
              </Link>

            </div>
          </div>

        </div>

        {/* Creator */}

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">

          <h3 className="text-white text-xl font-semibold">
            Designed & Developed by Annanth P Jose
          </h3>

          <a
            href="https://github.com/annanthpjose96/MERN-Movies-App"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 text-red-500 hover:text-red-400 transition font-medium"
          >
            View Project on GitHub
          </a>

        </div>

        {/* Copyright */}

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">

          <p className="text-gray-500">
            © {new Date().getFullYear()} Reelix. All Rights Reserved.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;