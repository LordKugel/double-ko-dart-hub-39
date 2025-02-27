
import { ReactNode } from "react";

interface MarqueeTextProps {
  children: ReactNode;
  speed?: number;
}

export const MarqueeText = ({ children, speed = 30 }: MarqueeTextProps) => {
  return (
    <div className="relative w-full overflow-hidden bg-black py-2 text-white">
      <div
        className="whitespace-nowrap inline-block animate-marquee"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {children}
        <span className="mx-4">•</span>
        {children}
        <span className="mx-4">•</span>
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
};
