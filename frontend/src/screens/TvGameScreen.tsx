import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import GameCanvas from "../components/game/GameCanvas";
import PlayerList from "../components/game/PlayerList";

const TvGameScreen: React.FC = () => {
    const { gameState, players } = useGameStore();

    return (
        <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {gameState === "playing" && (
                <div className="game-container h-full flex flex-col items-center justify-center">
                    <div className="relative">
                        <GameCanvas />
                    </div>

                    <div className="mt-6 w-full max-w-[800px]">
                        <PlayerList players={players} />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TvGameScreen;
