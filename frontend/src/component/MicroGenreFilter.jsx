import React from "react";
import {
  FaTag,
  FaBrain,
  FaClock,
  FaMicrochip,
  FaGem,
  FaUserSecret,
  FaDoorOpen,
  FaRocket,
  FaRadiation,
  FaSearch,
  FaVideo,
  FaRobot,
} from "react-icons/fa";

export const MICRO_GENRES = [
  { id: "all", name: "All Tropes", query: "", icon: FaTag },
  { id: "mind-bending", name: "Mind-Bending", query: "mind-bending", icon: FaBrain },
  { id: "time-loop", name: "Time Loop", query: "time loop", icon: FaClock },
  { id: "cyberpunk", name: "Cyberpunk", query: "cyberpunk", icon: FaMicrochip },
  { id: "heist", name: "Heist & Con", query: "heist", icon: FaGem },
  { id: "neo-noir", name: "Neo-Noir", query: "noir", icon: FaUserSecret },
  { id: "single-location", name: "Single Location", query: "room", icon: FaDoorOpen },
  { id: "space-epic", name: "Space Epic", query: "space", icon: FaRocket },
  { id: "post-apocalyptic", name: "Post-Apocalyptic", query: "apocalyptic", icon: FaRadiation },
  { id: "whodunit", name: "Whodunit Mystery", query: "mystery", icon: FaSearch },
  { id: "found-footage", name: "Found Footage", query: "footage", icon: FaVideo },
  { id: "ai-robotics", name: "AI & Androids", query: "robot", icon: FaRobot },
];

const MicroGenreFilter = ({ selectedTag, onSelectTag }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 mb-3">
        <FaTag className="text-red-500 text-xs" />
        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
          Micro-Genre Tropes
        </span>
      </div>

      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth touch-pan-x flex-nowrap"
        style={{ perspective: "600px" }}
      >
        {MICRO_GENRES.map((tag) => {
          const isActive = selectedTag === tag.id;
          const Icon = tag.icon;

          return (
            <button
              key={tag.id}
              onClick={() => onSelectTag(tag)}
              className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold shadow-lg shadow-red-600/20"
                  : "bg-zinc-900 text-gray-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
              }`}
              style={{
                transform: isActive
                  ? "perspective(600px) translateZ(8px) scale(1.08)"
                  : "perspective(600px) translateZ(0px)",
                transition: "transform 0.2s ease-out, box-shadow 0.2s ease",
              }}
            >
              <Icon className="text-[10px]" />
              <span>{tag.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MicroGenreFilter;
