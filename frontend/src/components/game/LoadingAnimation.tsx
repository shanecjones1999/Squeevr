import React from "react";
import { motion } from "framer-motion";
import { Loader2, Squirrel } from "lucide-react";

interface LoadingAnimationProps {
    message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
    message = "Starting game...",
}) => {
    return (
        <motion.div
            className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700 text-center max-w-md mx-4"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="flex justify-center mb-6"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <div className="relative">
                        <Squirrel className="h-12 w-12 text-indigo-500" />
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Squirrel className="h-12 w-12 text-indigo-300" />
                        </motion.div>
                    </div>
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-2">{message}</h3>

                <div className="flex items-center justify-center gap-2 text-gray-400">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <Loader2 className="h-4 w-4" />
                    </motion.div>
                    <span className="text-sm">Please wait...</span>
                </div>

                <motion.div
                    className="mt-4 flex justify-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-indigo-500 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default LoadingAnimation;
