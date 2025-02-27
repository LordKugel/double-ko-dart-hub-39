
import { ReactNode } from "react";

interface MarqueeTextProps {
  children: ReactNode;
  speed?: number;
}

export const MarqueeText = ({ children, speed = 30 }: MarqueeTextProps) => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-red-950 via-red-900 to-red-950 py-3 text-red-200">
      <div
        className="whitespace-nowrap inline-block"
        style={{
          animationDuration: `${speed}s`,
          animation: "marquee linear infinite",
        }}
      >
        {children}
        <span className="mx-4 text-red-400">•</span>
        {children}
        <span className="mx-4 text-red-400">•</span>
      </div>
      
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

