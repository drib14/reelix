import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaHeart,
  FaFilm,
  FaCog,
  FaServer,
  FaCheck,
  FaSignOutAlt,
  FaPlay,
  FaTrash,
  FaStar,
} from "react-icons/fa";

import Navbar from "../../component/Landing/Navbar";
import Footer from "../../component/Landing/Footer";
import SEO from "../../component/SEO";
import Loader from "../../component/Loader";

import { useProfileMutation } from "../../redux/api/users";
import { setCredentials, logout } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/api/users";
import { removeFromWatchlist } from "../../redux/features/watchlist/watchlistSlice";

import { ANIMATED_AVATARS, REELIX_FALLBACK_POSTER } from "../../utils/assets";

const STREAM_SERVERS = [
  { id: "server1", name: "VidSrc PRO HD", quality: "1080p / 4K", speed: "Ultra Fast" },
  { id: "server2", name: "AutoEmbed Ultra", quality: "1080p", speed: "Fast" },
  { id: "server3", name: "VidSrc.me", quality: "1080p", speed: "Multi-Sub" },
  { id: "server4", name: "VidSrc.icu", quality: "1080p", speed: "Dual Audio" },
];

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const watchlist = useSelector((state) => state.watchlist.movies);

  const [activeTab, setActiveTab] = useState("account");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedAvatarId, setSelectedAvatarId] = useState(() => {
    return localStorage.getItem("reelix-avatar-id") || "red_vip";
  });

  const activeAvatar = ANIMATED_AVATARS.find((a) => a.id === selectedAvatarId) || ANIMATED_AVATARS[0];

  const [preferredServer, setPreferredServer] = useState(() => {
    return localStorage.getItem("reelix-preferred-server") || "server1";
  });

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo]);

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatarId(avatarId);
    localStorage.setItem("reelix-avatar-id", avatarId);
    toast.success("Animated avatar updated!");
  };

  const handleServerSelect = (serverId) => {
    setPreferredServer(serverId);
    localStorage.setItem("reelix-preferred-server", serverId);
    toast.success("Preferred streaming server updated!");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password: password || undefined,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Update failed");
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col w-full">
      <SEO title={`${userInfo?.username || "User"}'s Profile — Reelix`} />
      <Navbar />

      {/* Hero Header Card */}
      <div className="pt-28 pb-10 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-red-950/40 border border-zinc-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
            {/* Avatar & User Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 ${activeAvatar.borderColor} shadow-2xl ${activeAvatar.shadowColor} bg-zinc-950 flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                >
                  <img
                    src={activeAvatar.image || activeAvatar.svg}
                    alt={activeAvatar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = activeAvatar.svg;
                    }}
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 bg-red-600 text-white px-2.5 py-0.5 rounded-xl text-[10px] font-black shadow-lg uppercase tracking-wider">
                  {activeAvatar.badge}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {userInfo?.username || "Streamer"}
                  </h1>
                  {userInfo?.isAdmin && (
                    <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <FaShieldAlt className="text-[10px]" />
                      Admin
                    </span>
                  )}
                </div>

                <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start gap-2 mb-4">
                  <FaEnvelope className="text-red-500 text-xs" />
                  <span>{userInfo?.email}</span>
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="bg-zinc-800/90 border border-zinc-700 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <FaHeart className="text-red-500 text-xs" />
                    <span>{watchlist.length} Watchlist Titles</span>
                  </span>
                  <span className="bg-zinc-800/90 border border-zinc-700 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <FaFilm className="text-amber-400 text-xs" />
                    <span>Free Unlimited HD Access</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={logoutHandler}
              className="bg-zinc-800/80 hover:bg-red-600 hover:text-white border border-zinc-700 text-gray-300 font-bold px-5 py-3 rounded-2xl transition duration-300 flex items-center gap-2 text-sm shadow-xl"
            >
              <FaSignOutAlt />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="mt-8 flex items-center gap-2 border-b border-zinc-800 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("account")}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "account"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "bg-zinc-900/80 text-gray-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            <FaUser className="text-xs" />
            <span>Account Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("watchlist")}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "watchlist"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "bg-zinc-900/80 text-gray-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            <FaHeart className="text-xs" />
            <span>My Watchlist ({watchlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "bg-zinc-900/80 text-gray-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            <FaCog className="text-xs" />
            <span>Player Preferences</span>
          </button>

          {userInfo?.isAdmin && (
            <Link
              to="/admin/movies/dashboard"
              className="px-6 py-3 rounded-2xl font-bold text-sm bg-purple-900/40 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white transition flex items-center gap-2 whitespace-nowrap ml-auto"
            >
              <FaShieldAlt className="text-xs" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>

        {/* Tab 1: Account Settings Form */}
        {activeTab === "account" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Avatar Selection Grid */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-black text-white tracking-tight mb-2">
                Character Profile Avatars
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Choose an illustrated character avatar for your Reelix streaming profile.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {ANIMATED_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.id)}
                    className={`relative p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden ${
                      selectedAvatarId === avatar.id
                        ? `bg-zinc-900 ${avatar.borderColor} ring-2 ring-red-600 scale-105 shadow-xl`
                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={avatar.image || avatar.svg}
                      alt={avatar.name}
                      className="w-14 h-14 rounded-xl object-cover"
                      onError={(e) => {
                        e.target.src = avatar.svg;
                      }}
                    />
                    <span className="text-[11px] font-bold text-white tracking-tight">
                      {avatar.name}
                    </span>
                    {selectedAvatarId === avatar.id && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-black shadow">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Col: Update Details Form */}
            <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-black text-white tracking-tight mb-2">
                Edit Profile Credentials
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Update your account username, email address, or security password.
              </p>

              <form onSubmit={submitHandler} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                      <input
                        type="text"
                        placeholder="Enter username"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-red-600 transition"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                      <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-red-600 transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-zinc-800/80">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                      New Password (Optional)
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                      <input
                        type="password"
                        placeholder="Leave blank to keep current"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-red-600 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none focus:border-red-600 transition"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loadingUpdateProfile}
                    className="px-8 py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold rounded-xl transition duration-300 shadow-lg shadow-red-600/30 flex items-center gap-2 text-sm"
                  >
                    <span>Save Changes</span>
                    {loadingUpdateProfile && <Loader />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Embedded Watchlist */}
        {activeTab === "watchlist" && (
          <div className="mt-8 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  My Personal Binge Watchlist
                </h2>
                <p className="text-gray-400 text-xs mt-1">
                  All movies and TV shows you saved to stream later.
                </p>
              </div>

              <span className="bg-zinc-800 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-zinc-700">
                {watchlist.length} Item{watchlist.length !== 1 ? "s" : ""} Saved
              </span>
            </div>

            {watchlist.length === 0 ? (
              <div className="text-center py-16 bg-zinc-950/60 rounded-2xl border border-zinc-800">
                <FaHeart className="text-zinc-700 text-4xl mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg">Your Watchlist is empty</h3>
                <p className="text-gray-400 text-xs mt-1 max-w-sm mx-auto">
                  Browse our catalog and click the Heart icon on any movie or TV series to save it here.
                </p>
                <Link
                  to="/movies"
                  className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 font-bold text-xs text-white rounded-xl transition shadow-lg shadow-red-600/30"
                >
                  <FaFilm />
                  <span>Browse Catalog</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {watchlist.map((movie) => {
                  const isTv = movie.media_type === "tv";
                  const detailUrl = `/movies/${movie._id || movie.id}${isTv ? "?type=tv" : ""}`;

                  return (
                    <div
                      key={movie._id || movie.id}
                      className="group relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-600/60 transition"
                    >
                      <div className="aspect-[2/3] w-full overflow-hidden relative">
                        <img
                          src={movie.image || movie.poster || REELIX_FALLBACK_POSTER}
                          alt={movie.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.src = REELIX_FALLBACK_POSTER;
                          }}
                        />

                        {/* Top Rating */}
                        {movie.rating && (
                          <div className="absolute top-2 left-2 bg-black/80 text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                            <FaStar className="text-[8px]" />
                            <span>{Number(movie.rating).toFixed(1)}</span>
                          </div>
                        )}

                        {/* Remove Action */}
                        <button
                          onClick={() => {
                            dispatch(removeFromWatchlist(movie._id));
                            toast.success("Removed from Watchlist");
                          }}
                          title="Remove from Watchlist"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center transition shadow border border-white/10"
                        >
                          <FaTrash className="text-[10px]" />
                        </button>

                        {/* Play Link Overlay */}
                        <Link
                          to={detailUrl}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        >
                          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition">
                            <FaPlay className="text-xs pl-0.5" />
                          </div>
                        </Link>
                      </div>

                      <div className="p-3">
                        <h4 className="text-white font-bold text-xs line-clamp-1">
                          {movie.name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Player & Mirror Preferences */}
        {activeTab === "settings" && (
          <div className="mt-8 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="text-xl font-black text-white tracking-tight mb-2">
              Default Streaming Mirror Preference
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Choose which HD streaming server launch by default when you click Stream Now.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STREAM_SERVERS.map((server) => (
                <button
                  key={server.id}
                  onClick={() => handleServerSelect(server.id)}
                  className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between h-32 ${
                    preferredServer === server.id
                      ? "bg-red-950/40 border-red-600 ring-2 ring-red-600/40"
                      : "bg-zinc-950/80 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-white flex items-center gap-2">
                      <FaServer className="text-red-500 text-xs" />
                      <span>{server.name}</span>
                    </span>
                    {preferredServer === server.id && (
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                        <FaCheck />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="bg-zinc-800 text-gray-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {server.quality}
                    </span>
                    <span className="text-emerald-400 font-semibold text-[10px]">
                      {server.speed}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

