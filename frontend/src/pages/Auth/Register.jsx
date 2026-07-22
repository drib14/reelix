import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../component/Loader";

import { setCredentials } from "../../redux/features/auth/authSlice";
import { useRegisterMutation } from "../../redux/api/users";

import { toast } from "react-toastify";
import Logo from "../../component/Logo";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();

  const sp = new URLSearchParams(search);

  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({
        username,
        email,
        password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));

      toast.success(`Welcome to Reelix, ${res.username}!`);

      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Registration Failed");
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      {/* Overlay */}

      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Register Card */}

      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-black/70 border border-gray-700 shadow-2xl backdrop-blur-xl p-10">
        <div className="flex justify-center mb-6">
          <Logo size="xl" />
        </div>

        <h1 className="text-center text-white text-4xl font-bold mt-8">
          Create Account 🍿
        </h1>

        <p className="text-center text-gray-400 mt-3 mb-10">
          Join Reelix and build your personal watchlist.
        </p>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Username */}

          <div>
            <label
              htmlFor="username"
              className="block text-gray-300 mb-2 font-medium"
            >
              Full Name
            </label>

            <input
              type="text"
              id="username"
              placeholder="Enter your full name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a]/90 border border-gray-600 text-white placeholder-gray-400 outline-none transition-all duration-300 focus:border-red-600 focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="block text-gray-300 mb-2 font-medium"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a]/90 border border-gray-600 text-white placeholder-gray-400 outline-none transition-all duration-300 focus:border-red-600 focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          {/* Password */}

          <div>
            <label
              htmlFor="password"
              className="block text-gray-300 mb-2 font-medium"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a]/90 border border-gray-600 text-white placeholder-gray-400 outline-none transition-all duration-300 focus:border-red-600 focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          {/* Confirm Password */}

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-300 mb-2 font-medium"
            >
              Confirm Password
            </label>

            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#1a1a1a]/90 border border-gray-600 text-white placeholder-gray-400 outline-none transition-all duration-300 focus:border-red-600 focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          {/* Register Button */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 text-white text-lg font-semibold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          {isLoading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-red-500 hover:text-red-400 font-semibold transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Text */}

      <p className="relative z-10 mt-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Reelix. Discover. Watch. Enjoy.
      </p>
    </section>
  );
};

export default Register;
