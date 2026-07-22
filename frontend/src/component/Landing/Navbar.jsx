import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/api/users";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const watchlist = useSelector((state) => state.watchlist.movies);
  const { userInfo } = useSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();

  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
      setMenuOpen(false);
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();

      dispatch(logout());

      toast.success("Logged out successfully");

      navigate("/");

      setProfileOpen(false);
      setMenuOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Logout Failed");
    }
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">

        <div className="flex items-center justify-between">

          {/* Logo */}

          <Link
            to="/"
            className="text-red-600 text-3xl md:text-5xl font-extrabold tracking-wide"
          >
            MovieFlix
          </Link>

          {/* Desktop Right */}

          <div className="hidden lg:flex items-center gap-4">

            <Link
              to="/watchlist"
              className="relative bg-gray-800 hover:bg-gray-700 transition px-5 py-2 rounded-md text-white font-semibold"
            >
              ❤️ Watchlist

              {watchlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </Link>

            <select className="bg-black/70 border border-gray-500 text-white px-4 py-2 rounded-md">
              <option>English</option>
              <option>Malayalam</option>
              <option>Hindi</option>
            </select>

            {!userInfo ? (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-md text-white font-semibold"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative">

                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-md text-white font-semibold"
                >
                  👤 {userInfo.username}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#181818] border border-gray-700 rounded-lg shadow-2xl overflow-hidden">

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-5 py-3 text-white hover:bg-red-600 transition"
                    >
                      👤 My Profile
                    </Link>

                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-5 py-3 text-white hover:bg-red-600 transition"
                    >
                      🚪 Logout
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* Mobile Hamburger */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white text-4xl"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Menu */}

        {menuOpen && (
          <div className="lg:hidden mt-6 bg-black/95 rounded-xl p-5 border border-gray-800">

            <form onSubmit={searchHandler} className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Search movies..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-[#222] border border-gray-600 text-white px-4 py-3 rounded-md outline-none"
              />

              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 py-3 rounded-md font-semibold text-white"
              >
                Search
              </button>

            </form>

            <Link
              to="/watchlist"
              onClick={() => setMenuOpen(false)}
              className="mt-5 flex justify-between items-center bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-md text-white font-semibold"
            >
              <span>❤️ Watchlist</span>

              {watchlist.length > 0 && (
                <span className="bg-red-600 w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  {watchlist.length}
                </span>
              )}

            </Link>

            <select className="w-full mt-5 bg-[#222] border border-gray-600 text-white px-4 py-3 rounded-md">
              <option>English</option>
              <option>Malayalam</option>
              <option>Hindi</option>
            </select>

            {!userInfo ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block mt-5 bg-red-600 hover:bg-red-700 text-center py-3 rounded-md text-white font-semibold"
              >
                Sign In
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block mt-5 bg-gray-800 hover:bg-gray-700 text-center py-3 rounded-md text-white font-semibold"
                >
                  👤 {userInfo.username}
                </Link>

                <button
                  onClick={logoutHandler}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 py-3 rounded-md text-white font-semibold"
                >
                  🚪 Logout
                </button>
              </>
            )}

          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;