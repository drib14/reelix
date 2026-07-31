import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFilm,
  FaTimes,
  FaCheckCircle,
  FaRegCircle,
  FaClock,
  FaLayerGroup,
  FaListOl,
  FaCalendarAlt,
  FaChevronRight,
} from "react-icons/fa";
import Tilt3DCard from "./Tilt3DCard";

const FRANCHISES = [
  {
    id: "mcu",
    name: "Marvel Cinematic Universe",
    icon: FaLayerGroup,
    movies: [
      { id: "1771", title: "Captain America: The First Avenger", year: 2011, duration: 124, chrono: 1, release: 5 },
      { id: "10138", title: "Iron Man", year: 2008, duration: 126, chrono: 2, release: 1 },
      { id: "10195", title: "Iron Man 2", year: 2010, duration: 124, chrono: 3, release: 3 },
      { id: "10129", title: "Thor", year: 2011, duration: 115, chrono: 4, release: 4 },
      { id: "24428", title: "The Avengers", year: 2012, duration: 143, chrono: 5, release: 6 },
      { id: "284052", title: "Doctor Strange", year: 2016, duration: 115, chrono: 6, release: 14 },
      { id: "284053", title: "Thor: Ragnarok", year: 2017, duration: 130, chrono: 7, release: 17 },
      { id: "299536", title: "Avengers: Infinity War", year: 2018, duration: 149, chrono: 8, release: 19 },
      { id: "299534", title: "Avengers: Endgame", year: 2019, duration: 181, chrono: 9, release: 22 },
    ],
  },
  {
    id: "starwars",
    name: "Star Wars Skywalker Saga",
    icon: FaFilm,
    movies: [
      { id: "1893", title: "Episode I: The Phantom Menace", year: 1999, duration: 136, chrono: 1, release: 4 },
      { id: "1894", title: "Episode II: Attack of the Clones", year: 2002, duration: 142, chrono: 2, release: 5 },
      { id: "1895", title: "Episode III: Revenge of the Sith", year: 2005, duration: 140, chrono: 3, release: 6 },
      { id: "11", title: "Episode IV: A New Hope", year: 1977, duration: 121, chrono: 4, release: 1 },
      { id: "1891", title: "Episode V: The Empire Strikes Back", year: 1980, duration: 124, chrono: 5, release: 2 },
      { id: "1892", title: "Episode VI: Return of the Jedi", year: 1983, duration: 131, chrono: 6, release: 3 },
    ],
  },
  {
    id: "lotr",
    name: "Lord of the Rings & Hobbit",
    icon: FaFilm,
    movies: [
      { id: "49051", title: "The Hobbit: An Unexpected Journey", year: 2012, duration: 169, chrono: 1, release: 4 },
      { id: "57158", title: "The Hobbit: The Desolation of Smaug", year: 2013, duration: 161, chrono: 2, release: 5 },
      { id: "122917", title: "The Hobbit: Battle of Five Armies", year: 2014, duration: 144, chrono: 3, release: 6 },
      { id: "120", title: "The Fellowship of the Ring", year: 2001, duration: 178, chrono: 4, release: 1 },
      { id: "121", title: "The Two Towers", year: 2002, duration: 179, chrono: 5, release: 2 },
      { id: "122", title: "The Return of the King", year: 2003, duration: 201, chrono: 6, release: 3 },
    ],
  },
  {
    id: "darkknight",
    name: "The Dark Knight Trilogy",
    icon: FaFilm,
    movies: [
      { id: "272", title: "Batman Begins", year: 2005, duration: 140, chrono: 1, release: 1 },
      { id: "155", title: "The Dark Knight", year: 2008, duration: 152, chrono: 2, release: 2 },
      { id: "49026", title: "The Dark Knight Rises", year: 2012, duration: 164, chrono: 3, release: 3 },
    ],
  },
];

const FranchiseMarathonModal = ({ isOpen, onClose }) => {
  const [selectedFranchise, setSelectedFranchise] = useState(FRANCHISES[0]);
  const [orderType, setOrderType] = useState("chrono");
  const [watchedState, setWatchedState] = useState(() => {
    try {
      const saved = localStorage.getItem("reelix_marathon_watched");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("reelix_marathon_watched", JSON.stringify(watchedState));
  }, [watchedState]);

  if (!isOpen) return null;

  const toggleWatch = (movieId) => {
    setWatchedState((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  const sortedMovies = [...selectedFranchise.movies].sort((a, b) =>
    orderType === "chrono" ? a.chrono - b.chrono : a.release - b.release
  );

  const totalMinutes = selectedFranchise.movies.reduce((acc, m) => acc + m.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const watchedCount = selectedFranchise.movies.filter((m) => watchedState[m.id]).length;
  const progressPct = Math.round((watchedCount / selectedFranchise.movies.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overscroll-contain animate-hero-entry">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col my-auto overscroll-contain">
        {/* Glow background effects */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-red-600/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-red-600/25">
              <FaLayerGroup />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>Franchise Marathon Guide</span>
                <FaFilm className="text-amber-400 text-xs" />
              </h2>
              <p className="text-xs text-gray-400">Chronological & Release Binge Order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full bg-zinc-800/60 hover:bg-zinc-700 transition border border-zinc-700/60"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Franchise Tabs */}
        <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar border-b border-zinc-800/80">
          {FRANCHISES.map((f) => {
            const Icon = f.icon;
            const active = selectedFranchise.id === f.id;

            return (
              <button
                key={f.id}
                onClick={() => setSelectedFranchise(f)}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  active
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                    : "bg-zinc-950 text-gray-400 border border-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="text-[10px]" />
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>

        {/* Info & Order Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 bg-zinc-950/70 rounded-2xl border border-zinc-800/80 my-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-gray-200 font-bold">
              <FaClock className="text-amber-400" />
              <span>{totalHours} hrs total</span>
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-red-400 font-extrabold">
              {watchedCount}/{selectedFranchise.movies.length} Completed ({progressPct}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full sm:w-auto flex-1 sm:max-w-[160px] bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setOrderType("chrono")}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                orderType === "chrono" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <FaListOl className="text-[9px]" />
              <span>Chronological</span>
            </button>
            <button
              onClick={() => setOrderType("release")}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                orderType === "release" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <FaCalendarAlt className="text-[9px]" />
              <span>Release</span>
            </button>
          </div>
        </div>

        {/* Movie List with Fixed Readability */}
        <div className="overflow-y-auto space-y-2 pr-1 no-scrollbar flex-1 overscroll-contain">
          {sortedMovies.map((m, idx) => {
            const isDone = !!watchedState[m.id];

            return (
              <Tilt3DCard key={m.id} maxTilt={4} scale={1.01} className="w-full">
                <div
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                    isDone
                      ? "bg-zinc-900/90 border-emerald-500/40 shadow-sm"
                      : "bg-zinc-950 border-zinc-800/80 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => toggleWatch(m.id)}
                      className="text-lg hover:scale-110 transition flex-shrink-0"
                    >
                      {isDone ? (
                        <FaCheckCircle className="text-emerald-400 shadow-sm" />
                      ) : (
                        <FaRegCircle className="text-zinc-600 hover:text-white" />
                      )}
                    </button>

                    <span className="w-6 text-center font-black text-xs text-red-400 bg-red-950/60 py-1 rounded-lg border border-red-800/40 flex-shrink-0">
                      #{idx + 1}
                    </span>

                    <div>
                      {/* FIXED READABILITY: Highly visible text for completed & uncompleted items */}
                      <h4
                        className={`text-sm font-bold tracking-tight ${
                          isDone
                            ? "text-emerald-300 font-extrabold line-through opacity-90"
                            : "text-white"
                        }`}
                      >
                        {m.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5 font-medium">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-[9px] text-gray-500" />
                          <span>{m.year}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[9px] text-gray-500" />
                          <span>{m.duration} mins</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/movies/${m.id}`}
                    onClick={onClose}
                    className="bg-zinc-900 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition border border-zinc-700 flex items-center gap-1.5 flex-shrink-0 group shadow"
                  >
                    <span>View</span>
                    <FaChevronRight className="text-[9px] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </Tilt3DCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FranchiseMarathonModal;
