import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import LoadingAnimation from "../components/game/LoadingAnimation";
import { AnimatePresence } from "framer-motion";

const PlayerGameScreen: React.FC = () => {
    const { roomCode, gameState } = useGameStore();

    return (
        <>
            <AnimatePresence>
                {gameState.isLoading && (
                    <LoadingAnimation message="Game starting..." />
                )}
            </AnimatePresence>

            <motion.div
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        {gameState.isLoading 
                            ? "Game is starting..." 
                            : "Waiting for game to start"
                        }
                    </h2>
                    <p className="text-gray-300">Room Code: {roomCode}</p>
                    
                    {gameState.isLoading && (
                        <motion.div
                            className="mt-4 flex justify-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
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
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default PlayerGameScreen;