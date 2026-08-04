import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[99999] p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 p-6 rounded-2xl z-10 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex justify-end mb-2">
          <button
            className="text-gray-400 hover:text-white font-bold p-1 focus:outline-none"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="text-left text-white">{children}</div>
      </div>
    </div>,
    document.body
  );
};
export default Modal;
