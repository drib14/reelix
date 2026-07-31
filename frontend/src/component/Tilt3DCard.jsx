import React, { useRef, useState } from "react";

/**
 * 3D Interactive Card Component with Perspective Tilt and Dynamic Light Glare
 */
const Tilt3DCard = ({
  children,
  className = "",
  maxTilt = 14,
  scale = 1.04,
  perspective = 1000,
  speed = 400,
}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to center of element (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width;
    const yPct = mouseY / height;

    const rotateX = ((yPct - 0.5) * -maxTilt).toFixed(2);
    const rotateY = ((xPct - 0.5) * maxTilt).toFixed(2);

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: `transform 100ms ease-out`,
    });

    setGlarePos({
      x: (xPct * 100).toFixed(1),
      y: (yPct * 100).toFixed(1),
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
    });
  };

  return (
    <div
      ref={cardRef}
      className={`card-3d-container relative overflow-hidden rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        "--glare-x": `${glarePos.x}%`,
        "--glare-y": `${glarePos.y}%`,
      }}
    >
      <div className="card-3d-wrapper h-full w-full">
        {children}
        <div className="card-3d-glare" />
      </div>
    </div>
  );
};

export default Tilt3DCard;
