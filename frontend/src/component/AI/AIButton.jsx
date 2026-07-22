import { FaRobot } from "react-icons/fa";

const AIButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed
        bottom-8
        right-8
        z-[999]
        w-16
        h-16
        rounded-full
        bg-red-600
        hover:bg-red-700
        shadow-2xl
        hover:scale-110
        transition-all
        duration-300
        flex
        items-center
        justify-center
        group
      "
    >
      <FaRobot
        size={28}
        className="text-white group-hover:rotate-12 transition-transform duration-300"
      />
    </button>
  );
};

export default AIButton;