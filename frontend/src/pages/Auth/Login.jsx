import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../component/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/users";
import { toast } from "react-toastify";
import Logo from "../../component/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success(`Welcome back, ${res.username}!`);
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Login failed");
    }
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-between items-center bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-black/80 to-black/90 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full flex justify-between items-center max-w-7xl mx-auto py-2">
        <Logo size="md" />
        <Link to="/" className="text-sm font-semibold text-gray-300 hover:text-white transition">
          ← Back to Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md my-auto rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl backdrop-blur-2xl p-6 sm:p-10">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        <h1 className="text-center text-white text-2xl sm:text-3xl font-black tracking-tight">
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 text-sm mt-2 mb-8">
          Sign in to access your custom watchlist and recommendations.
        </p>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white placeholder-gray-500 outline-none text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-gray-300 text-xs font-semibold uppercase tracking-wider">
                Password
              </label>
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white placeholder-gray-500 outline-none text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 transition duration-300 text-white font-bold shadow-lg shadow-red-600/30 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {isLoading && (
            <div className="flex justify-center pt-2">
              <Loader />
            </div>
          )}
        </form>

        <div className="mt-8 text-center border-t border-zinc-800/80 pt-6">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-red-500 hover:text-red-400 font-bold transition ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <p className="relative z-10 text-center text-gray-500 text-xs py-2">
        © {new Date().getFullYear()} Reelix. All rights reserved.
      </p>
    </section>
  );
};

export default Login;
