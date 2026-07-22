import { Link } from "react-router-dom";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="bg-[#09090b] border-t border-zinc-800/80 mt-20 pt-16 pb-12 text-sm text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Reelix is a next-generation movie streaming and recommendation platform. Powered by TMDB, React, Redux, Node.js & AI.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-950/60 text-red-400 border border-red-500/30">
                v2.0 • Ultra HD
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wider uppercase">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:text-red-500 transition">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-red-500 transition">
                  All Movies Catalog
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-red-500 transition">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Account */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wider uppercase">
              Account & Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/login" className="hover:text-red-500 transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-red-500 transition">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-red-500 transition">
                  User Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Features */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wider uppercase">
              Features
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <span>🤖 AI Movie Assistant</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🎬 Real-time TMDB Search</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⚡ High-speed Streaming</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Reelix Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Designed & Developed for Movie Enthusiasts</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;