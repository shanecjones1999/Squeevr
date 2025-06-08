import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTransitionProps {
    countdown: number;
}

const CountdownTransition: React.FC<CountdownTransitionProps> = ({
    countdown,
}) => {
    if (!countdown) return null;

    // Calculate progress (3 = 0%, 2 = 33%, 1 = 66%, 0 = 100%)
    const progress = ((4 - countdown) / 4) * 100;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key="countdown-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    {/* Main container */}
                    <motion.div
                        className="relative flex flex-col items-center"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20 
                        }}
                    >
                        {/* Glowing background circle */}
                        <motion.div
                            className="absolute w-32 h-32 rounded-full bg-indigo-500/20 blur-xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        {/* Progress ring */}
                        <div className="relative w-24 h-24">
                            <svg
                                className="w-24 h-24 transform -rotate-90"
                                viewBox="0 0 100 100"
                            >
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="rgba(255, 255, 255, 0.1)"
                                    strokeWidth="3"
                                    fill="none"
                                />
                                
                                {/* Progress circle */}
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="rgb(99, 102, 241)" // indigo-500
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 45}`}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                                    animate={{ 
                                        strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100)
                                    }}
                                    transition={{ 
                                        duration: 0.8,
                                        ease: "easeOut"
                                    }}
                                    style={{
                                        filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))"
                                    }}
                                />
                            </svg>

                            {/* Center content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    key={countdown}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 400, 
                                        damping: 15 
                                    }}
                                    className="text-3xl font-bold text-white"
                                >
                                    {countdown}
                                </motion.div>
                            </div>
                        </div>

                        {/* Starting text */}
                        <motion.div
                            className="mt-4 text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="text-white font-medium text-lg">
                                Get Ready
                            </p>
                            <motion.div
                                className="flex justify-center gap-1 mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                            ease: "easeInOut",
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CountdownTransition;