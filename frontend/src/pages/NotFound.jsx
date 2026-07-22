import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-red-600 text-9xl font-black tracking-widest drop-shadow-[0_10px_30px_rgba(229,9,20,0.5)]">
          404
        </h1>

        <h2 className="text-white text-4xl sm:text-5xl font-bold mt-6">
          Lost Your Way?
        </h2>

        <p className="text-gray-400 text-base sm:text-lg mt-4 leading-relaxed">
          The page you are looking for doesn't exist, has been removed, or the link is incorrect.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="bg-red-600 hover:bg-red-700 transition px-8 py-3.5 rounded-xl text-base font-bold text-white shadow-lg shadow-red-600/30 flex items-center gap-2"
          >
            <FaHome className="text-base" />
            <span>Go Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition px-8 py-3.5 rounded-xl text-base font-bold text-white flex items-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;