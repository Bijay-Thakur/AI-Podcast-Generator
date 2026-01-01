import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

export function WritingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Robot/Bot Icon with glow */}
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50" />
          <motion.div
            className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 p-8 rounded-3xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(168, 85, 247, 0.5)",
                "0 0 40px rgba(236, 72, 153, 0.5)",
                "0 0 20px rgba(168, 85, 247, 0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Bot className="w-16 h-16 text-white" />
          </motion.div>
        </div>

        {/* Sparkles around the bot */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              x: [
                "-50%",
                `${Math.cos((i * Math.PI * 2) / 6) * 80 - 50}%`,
                "-50%",
              ],
              y: [
                "-50%",
                `${Math.sin((i * Math.PI * 2) / 6) * 80 - 50}%`,
                "-50%",
              ],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
          </motion.div>
        ))}
      </motion.div>

      {/* Typing indicator */}
      <motion.div
        className="flex items-center gap-2 text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-lg font-medium">AI is writing your script</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-400 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Writing lines animation */}
      <div className="w-64 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-2 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

