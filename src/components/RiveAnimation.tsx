"use client";

/**
 * Rive animation component.
 * Place your .riv file at /public/animations/smile.riv and swap the fallback
 * for a Rive canvas using @rive-app/react-canvas.
 */
export function RiveAnimation() {
  return (
    <div className="relative z-10 flex h-full w-full items-center justify-center">
      <div className="relative">
        <div className="animate-pulse-slow h-48 w-48 rounded-full bg-gradient-to-br from-sky-400/20 to-cyan-400/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="h-40 w-40 animate-float"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" fill="url(#grad)" opacity="0.3" />
            <path
              d="M60 110 Q100 150 140 110"
              stroke="#0ea5e9"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="75" cy="85" r="8" fill="#0ea5e9" />
            <circle cx="125" cy="85" r="8" fill="#0ea5e9" />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
