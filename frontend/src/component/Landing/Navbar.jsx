import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d0d0e]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Logo & Nav Links */}
          <div className="flex items-center gap-8">
            <Logo size="md" />

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/"
                className={`transition-colors hover:text-red-500 ${
                  isActive("/") ? "text-white font-bold" : "text-gray-300"
                }`}
              >
                Home
              </Link>
              <Link
                to="/movies"
                className={`transition-colors hover:text-red-500 ${
                  isActive("/movies") ? "text-white font-bold" : "text-gray-300"
                }`}
              >
                Explore Movies
              </Link>
              <Link
                to="/watchlist"
                className={`transition-colors hover:text-red-500 flex items-center gap-1 ${
                  isActive("/watchlist") ? "text-white font-bold" : "text-gray-300"
                }`}
              >
                Watchlist
                {watchlist.length > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {watchlist.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* Center/Right Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            <form onSubmit={searchHandler} className="w-full relative">
              <input
                type="text"
                placeholder="Search movies, genres..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-700/80 focus:border-red-500 text-white text-sm px-4 py-2 pr-10 rounded-full outline-none backdrop-blur-sm transition-all focus:ring-1 focus:ring-red-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
              >
                🔍
              </button>
            </form>
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {userInfo?.isAdmin && (
              <Link
                to="/admin/movies/dashboard"
                className="bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold px-3 py-2 rounded-lg text-red-400 border border-red-500/30 transition"
              >
                ⚡ Admin Panel
              </Link>
            )}

            {!userInfo ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition px-4 py-2 rounded-lg text-white text-sm font-medium"
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center text-xs font-bold uppercase">
                    {userInfo.username?.[0] || "U"}
                  </span>
                  <span>{userInfo.username}</span>
                  <span className="text-xs text-gray-400">▼</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50">
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
                      👤 My Profile
                    </Link>

                    {userInfo?.isAdmin && (
                      <Link
                        to="/admin/movies/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 transition"
                      >
                        ⚡ Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={logoutHandler}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-600/10 transition border-t border-zinc-800/80"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white hover:text-red-500 transition rounded-lg bg-zinc-900/60 border border-zinc-800"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Slide-down Drawer */}
        {menuOpen && (
          <div className="md:hidden mt-4 bg-zinc-950/95 border border-zinc-800 rounded-2xl p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            <form onSubmit={searchHandler} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 pr-10 rounded-xl outline-none text-sm focus:border-red-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                🔍
              </button>
            </form>

            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl bg-zinc-900/60 text-white font-medium hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>🏠 Home</span>
              </Link>
              <Link
                to="/movies"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl bg-zinc-900/60 text-white font-medium hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>🎬 Explore Movies</span>
              </Link>
              <Link
                to="/watchlist"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl bg-zinc-900/60 text-white font-medium hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>❤️ Watchlist</span>
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
                  className="px-4 py-3 rounded-xl bg-zinc-900/60 text-white font-medium hover:bg-zinc-800"
                >
                  👤 Profile ({userInfo.username})
                </Link>
                {userInfo?.isAdmin && (
                  <Link
                    to="/admin/movies/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl bg-red-950/40 text-red-400 border border-red-500/30 font-medium hover:bg-red-900/40"
                  >
                    ⚡ Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={logoutHandler}
                  className="w-full text-left px-4 py-3 rounded-xl bg-red-600/20 text-red-400 font-medium hover:bg-red-600/30"
                >
                  🚪 Logout
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