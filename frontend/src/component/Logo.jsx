import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ size = "md", withText = true, className = "" }) => {
  // Size mappings
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
    xl: "text-4xl md:text-6xl",
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* SVG Icon Emblem */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-[0_4px_12px_rgba(229,9,20,0.4)]">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E50914" />
              <stop offset="50%" stopColor="#FF2A54" />
              <stop offset="100%" stopColor="#9B51E0" />
            </linearGradient>
            <linearGradient id="logoGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2A54" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
            </linearGradient>
          </defs>

          <!-- Badge -->
          <rect x="32" y="32" width="448" height="448" rx="112" fill="#0D0D0E" stroke="url(#logoGrad)" strokeWidth="12" />
          <rect x="32" y="32" width="448" height="448" rx="112" fill="url(#logoGlow)" />

          <!-- Emblem R + Play -->
          <g>
            <rect x="140" y="120" width="56" height="272" rx="28" fill="url(#logoGrad)" />
            <path d="M 168 120 H 280 C 340 120 380 155 380 210 C 380 265 340 300 280 300 H 168 Z" fill="none" stroke="url(#logoGrad)" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 240 260 L 360 392" fill="none" stroke="url(#logoGrad)" strokeWidth="52" strokeLinecap="round" />
            <polygon points="250,175 250,245 305,210" fill="#FFFFFF" opacity="0.95" />
          </g>
        </svg>
      </div>

      {/* Text Brand */}
      {withText && (
        <span className={`font-black tracking-wider uppercase font-sans ${textSizes[size]}`}>
          <span className="text-white">REEL</span>
          <span className="bg-gradient-to-r from-red-600 via-rose-500 to-purple-500 bg-clip-text text-transparent">IX</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
