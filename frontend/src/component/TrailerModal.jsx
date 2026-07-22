import { FaTimes } from "react-icons/fa";

const TrailerModal = ({ trailer, isOpen, onClose }) => {
  if (!isOpen || !trailer) return null;

  const videoId = trailer.split("v=")[1]?.split("&")[0];

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-6">
      <div className="relative w-full max-w-6xl">

        <button
          onClick={onClose}
          className="absolute -top-14 right-0 text-white text-3xl hover:text-red-500 transition"
        >
          <FaTimes />
        </button>

        <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-2xl">

          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />

        </div>
      </div>
    </div>
  );
};

export default TrailerModal;