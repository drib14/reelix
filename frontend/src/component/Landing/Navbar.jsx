import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaHeart,
  FaFilm,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaShieldAlt,
  FaHome,
  FaCompass,
} from "react-icons/fa";

import { logout } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/api/users";

import Logo from "../Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const watchlist = useSelector((state) => state.watchlist.movies);
  const { userInfo } = useSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${encodeURIComponent(keyword.trim())}`);
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

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#141414]/95 backdrop-blur-xl border-b border-zinc-800 shadow-2xl py-3"
          : "bg-gradient-to-b from-black/95 via-black/60 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Logo size="md" />

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/"
                className={`flex items-center gap-2 transition-colors hover:text-red-500 ${
                  isActive("/") ? "text-white font-bold" : "text-gray-300"
                }`}
              >
                <FaHome className="text-xs" />
                <span>Home</span>
              </Link>
              <Link
                to="/movies"
                className={`flex items-center gap-2 transition-colors hover:text-red-500 ${
                  isActive("/movies") ? "text-white font-bold" : "text-gray-300"
                }`}
              >
                <FaCompass className="text-xs" />
                <span>Explore Movies</span>
              </Link>
              <Link
                to="/watchlist"
                className={`flex items-center gap-2 transition-colors hover:text-red-500 ${
                  isActive("/watchlist") ? "text-white font-bold" : "text-gray-300"
                }`}
              >
                <FaHeart className="text-xs text-red-500" />
                <span>Watchlist</span>
                {watchlist.length > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {watchlist.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* Search Bar (Desktop Netflix Style) */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
            <form onSubmit={searchHandler} className="w-full relative">
              <input
                type="text"
                placeholder="Search titles, genres, actors..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-700/80 focus:border-red-500 text-white text-sm px-4 py-2 pl-10 pr-10 rounded-full outline-none backdrop-blur-sm transition-all focus:ring-1 focus:ring-red-500 placeholder-gray-400"
              />
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  <FaTimes />
                </button>
              )}
            </form>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {userInfo?.isAdmin && (
              <Link
                to="/admin/movies/dashboard"
                className="bg-red-950/60 hover:bg-red-900/60 text-xs font-semibold px-3.5 py-2 rounded-xl text-red-400 border border-red-500/40 transition flex items-center gap-1.5"
              >
                <FaShieldAlt className="text-xs" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {!userInfo ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-xl text-white text-sm font-semibold shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 transition px-4 py-2 rounded-xl text-white text-sm font-medium"
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                    {userInfo.username?.[0] || "U"}
                  </span>
                  <span>{userInfo.username}</span>
                  <FaChevronDown className="text-[10px] text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 animate-in fade-in duration-200">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {userInfo.email || userInfo.username}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-zinc-800 hover:text-white transition"
                    >
                      <FaUser className="text-gray-400 text-xs" />
                      <span>My Profile</span>
                    </Link>

                    {userInfo?.isAdmin && (
                      <Link
                        to="/admin/movies/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 transition"
                      >
                        <FaShieldAlt className="text-xs" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={logoutHandler}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-600/10 transition border-t border-zinc-800/80"
                    >
                      <FaSignOutAlt className="text-xs" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white hover:text-red-500 transition rounded-xl bg-zinc-900 border border-zinc-800"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {menuOpen && (
          <div className="md:hidden mt-4 bg-zinc-950/95 border border-zinc-800 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            <form onSubmit={searchHandler} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 pl-10 pr-10 rounded-xl outline-none text-sm focus:border-red-500"
              />
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            </form>

            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl bg-zinc-900/60 text-white font-medium hover:bg-zinc-800 flex items-center gap-3"
              >
                <FaHome className="text-gray-400" />
                <span>Home</span>
              </Link>
              <Link
                to="/movies"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl bg-zinc-900/60 text-white font-medium hover:bg-zinc-800 flex items-center gap-3"
              >
                <FaFilm className="text-gray-400" />
                <span>Explore Movies</span>
              </Link>
              <Link
                to="/watchlist"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl bg-zinc-900/60 text-white font-medium hover:bg-zinc-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FaHeart className="text-red-500" />
                  <span>Watchlist</span>
                </div>
                {watchlist.length > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {watchlist.length}
                  </span>
                )}
              </Link>
            </nav>

            {!userInfo ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full bg-red-600 hover:bg-red-700 text-center py-3 rounded-xl text-white font-semibold shadow-lg shadow-red-600/30"
              >
                Sign In
              </Link>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl bg-zinc-900/60 text-white font-medium hover:bg-zinc-800 flex items-center gap-3"
                >
                  <FaUser className="text-gray-400" />
                  <span>Profile ({userInfo.username})</span>
                </Link>
                {userInfo?.isAdmin && (
                  <Link
                    to="/admin/movies/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl bg-red-950/40 text-red-400 border border-red-500/30 font-medium hover:bg-red-900/40 flex items-center gap-3"
                  >
                    <FaShieldAlt />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={logoutHandler}
                  className="w-full text-left px-4 py-3 rounded-xl bg-red-600/20 text-red-400 font-medium hover:bg-red-600/30 flex items-center gap-3"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;