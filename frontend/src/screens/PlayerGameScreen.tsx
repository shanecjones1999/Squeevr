import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";

const PlayerGameScreen: React.FC = () => {
    const { roomCode } = useGameStore();

    return (
        <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 text-center">
                <h2 className="text-2xl font-bold mb-4">
                    Waiting for game to start
                </h2>
                <p className="text-gray-300">Room Code: {roomCode}</p>
            </div>
        </motion.div>
    );
};

export default PlayerGameScreen;
