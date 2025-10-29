import React from "react";

const Globe: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes earthRotate {
            0% { background-position: 0 0; }
            100% { background-position: 400px 0; }
          }
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes energyPulse { 0%,100% { opacity:0.3; transform: scale(1); } 50% { opacity:1; transform: scale(1.1); } }
          @keyframes energyFlow { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
          @keyframes orbitRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes lightning { 0%,90%,100% { opacity: 0; } 5%,85% { opacity: 1; } }
          @keyframes spiderWeb { 0% { stroke-dasharray: 0 1000; } 100% { stroke-dasharray: 1000 0; } }
        `}
      </style>
      <div className="flex items-center justify-center h-screen">
        <div
          className="relative w-[250px] h-[250px] rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.2),-5px_0_8px_#c3f4ff_inset,15px_2px_25px_#000_inset,-24px_-2px_34px_#c3f4ff99_inset,250px_0_44px_#00000066_inset,150px_0_38px_#000000aa_inset]"
          style={{
            backgroundImage: "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "left",
            animation: "earthRotate 30s linear infinite",
          }}
        >
          {/* Celsia Energy Network - Orange neon lights */}
          <div
            className="absolute top-[20%] left-[30%] w-2 h-2 rounded-full"
            style={{ 
              background: 'radial-gradient(circle, #f4721e 0%, #e55a00 50%, transparent 100%)',
              boxShadow: '0 0 10px #f4721e, 0 0 20px #f4721e, 0 0 30px #f4721e',
              animation: "energyPulse 2s infinite"
            }}
          />
          <div
            className="absolute top-[40%] left-[60%] w-2 h-2 rounded-full"
            style={{ 
              background: 'radial-gradient(circle, #f4721e 0%, #e55a00 50%, transparent 100%)',
              boxShadow: '0 0 10px #f4721e, 0 0 20px #f4721e, 0 0 30px #f4721e',
              animation: "energyPulse 2.5s infinite"
            }}
          />
          <div
            className="absolute top-[60%] left-[20%] w-2 h-2 rounded-full"
            style={{ 
              background: 'radial-gradient(circle, #f4721e 0%, #e55a00 50%, transparent 100%)',
              boxShadow: '0 0 10px #f4721e, 0 0 20px #f4721e, 0 0 30px #f4721e',
              animation: "energyPulse 1.8s infinite"
            }}
          />
          <div
            className="absolute top-[70%] left-[70%] w-2 h-2 rounded-full"
            style={{ 
              background: 'radial-gradient(circle, #f4721e 0%, #e55a00 50%, transparent 100%)',
              boxShadow: '0 0 10px #f4721e, 0 0 20px #f4721e, 0 0 30px #f4721e',
              animation: "energyPulse 2.2s infinite"
            }}
          />
          <div
            className="absolute top-[30%] left-[80%] w-2 h-2 rounded-full"
            style={{ 
              background: 'radial-gradient(circle, #f4721e 0%, #e55a00 50%, transparent 100%)',
              boxShadow: '0 0 10px #f4721e, 0 0 20px #f4721e, 0 0 30px #f4721e',
              animation: "energyPulse 1.5s infinite"
            }}
          />

          {/* Energy Network Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f4721e" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#e55a00" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f4721e" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d="M 75 50 Q 125 100 200 80"
              stroke="url(#energyGradient)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="5,5"
              style={{ 
                animation: "energyFlow 3s linear infinite",
                filter: "drop-shadow(0 0 3px #f4721e)"
              }}
            />
            <path
              d="M 50 120 Q 100 150 180 200"
              stroke="url(#energyGradient)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="5,5"
              style={{ 
                animation: "energyFlow 4s linear infinite",
                filter: "drop-shadow(0 0 3px #f4721e)"
              }}
            />
            <path
              d="M 200 60 Q 150 120 80 180"
              stroke="url(#energyGradient)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="5,5"
              style={{ 
                animation: "energyFlow 3.5s linear infinite",
                filter: "drop-shadow(0 0 3px #f4721e)"
              }}
            />
          </svg>

          {/* Orbital Energy Ring */}
          <div 
            className="absolute inset-[-20px] rounded-full border border-orange-500/30"
            style={{
              animation: "orbitRotate 20s linear infinite",
              boxShadow: "0 0 20px rgba(244, 114, 30, 0.3), inset 0 0 20px rgba(244, 114, 30, 0.1)"
            }}
          />
          <div 
            className="absolute inset-[-30px] rounded-full border border-orange-500/20"
            style={{
              animation: "orbitRotate 30s linear infinite reverse",
              boxShadow: "0 0 15px rgba(244, 114, 30, 0.2)"
            }}
          />

          {/* Stars */}
          <div
            className="absolute left-[-20px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling 3s infinite" }}
          />
          <div
            className="absolute left-[-40px] top-[30px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling-slow 2s infinite" }}
          />
          <div
            className="absolute left-[350px] top-[90px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling-long 4s infinite" }}
          />
          <div
            className="absolute left-[200px] top-[290px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling 3s infinite" }}
          />
          <div
            className="absolute left-[50px] top-[270px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling-fast 1.5s infinite" }}
          />
          <div
            className="absolute left-[250px] top-[-50px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling-long 4s infinite" }}
          />
          <div
            className="absolute left-[290px] top-[60px] w-1 h-1 bg-white rounded-full"
            style={{ animation: "twinkling-slow 2s infinite" }}
          />
        </div>
      </div>
    </>
  );
};

export default Globe;