import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function SoundWaves() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reduce animations on mobile for better performance
  const waveCount = isMobile ? 3 : 6;
  const particleCount = isMobile ? 6 : 12;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 sm:opacity-30" style={{ willChange: 'transform' }}>
      {/* Central pulsing waves */}
      {[...Array(waveCount)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{
            scale: [0, 1.5, 3, 4.5],
            opacity: [0.8, 0.6, 0.3, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeOut",
          }}
        >
          <div
            className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] rounded-full border-2"
            style={{
              borderColor: `hsl(${280 + i * 40}, 70%, 60%)`,
              boxShadow: `0 0 ${isMobile ? '10px' : '20px'} hsl(${280 + i * 40}, 70%, 60%)`,
              willChange: 'transform',
            }}
          />
        </motion.div>
      ))}

      {/* Corner waves */}
      {[
        { position: "top-0 left-0", transform: "translate(-50%, -50%)" },
        { position: "top-0 right-0", transform: "translate(50%, -50%)" },
        { position: "bottom-0 left-0", transform: "translate(-50%, 50%)" },
        { position: "bottom-0 right-0", transform: "translate(50%, 50%)" },
      ].map((corner, cornerIndex) => (
        <motion.div
          key={`corner-${cornerIndex}`}
          className={`absolute ${corner.position}`}
          style={{ transform: corner.transform }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{
            scale: [0, 1, 2, 3],
            opacity: [0.6, 0.4, 0.2, 0],
            rotate: [0, 90, 180, 270],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: cornerIndex * 2,
            ease: "easeOut",
          }}
        >
          <div
            className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-full border"
            style={{
              borderColor: `hsl(${320 + cornerIndex * 20}, 60%, 50%)`,
              boxShadow: `0 0 ${isMobile ? '8px' : '15px'} hsl(${320 + cornerIndex * 20}, 60%, 50%)`,
              willChange: 'transform',
            }}
          />
        </motion.div>
      ))}

      {/* Floating particles - reduced on mobile */}
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full blur-sm"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${Math.random() * 360}, 80%, 70%)`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            scale: [0.5, 1.5, 0.5],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Central glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent)",
        }}
      />
    </div>
  );
}
