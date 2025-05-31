import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import GameCanvas from "../components/game/GameCanvas";
import GameControls from "../components/game/GameControls";
import { usePeerConnection } from "../hooks/usePeerConnection";
import PlayerList from "../components/game/PlayerList";

const PlayerGameScreen: React.FC = () => {
    const { gameState, players, clientId, roomCode } = useGameStore();
    const { websocket } = usePeerConnection();

    return (
        <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {gameState === "waiting" ? (
                <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Waiting for game to start
                    </h2>
                    <p className="text-gray-300">Room Code: {roomCode}</p>
                </div>
            ) : (
                gameState === "playing" && (
                    <div className="game-container h-full flex flex-col items-center justify-center">
                        <div className="relative">
                            <GameCanvas />
                            <div className="absolute inset-x-0 bottom-8">
                                <GameControls websocket={websocket} />
                            </div>
                        </div>

                        <div className="mt-6 w-full max-w-[800px]">
                            <PlayerList players={players} />
                        </div>
                    </div>
                )
            )}
        </motion.div>
    );
};

export default PlayerGameScreen;