import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import GameCanvas from "../components/game/GameCanvas";
import GameControls from "../components/game/GameControls";
import PlayerList from "../components/game/PlayerList";
import GameOver from "../components/game/GameOver";
import { usePeerConnection } from "../hooks/usePeerConnection";
import { useGameLoop } from "../hooks/useGameLoop";

const GameScreen: React.FC = () => {
    const { isHost, gameState, players, startGame, resetGame, leaveRoom } =
        useGameStore();

    const { isConnected } = usePeerConnection();
    const { isInitialized } = useGameLoop();

    return (
        <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="h-full flex flex-col">
                {gameState === "waiting" && (
                    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 text-center">
                        <h2 className="text-2xl font-bold mb-4">
                            Waiting for game to start
                        </h2>
                        {isHost ? (
                            <div className="space-y-4">
                                <PlayerList players={players} />

                                <div className="flex justify-center gap-4 mt-4">
                                    <button
                                        className="btn-primary"
                                        disabled={
                                            players.length < 2 || !isConnected
                                        }
                                        onClick={() => startGame()}
                                    >
                                        Start Game
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={leaveRoom}
                                    >
                                        Leave Room
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-6 bg-gray-900 rounded-lg">
                                    <p className="text-gray-300">
                                        {isConnected
                                            ? "Connected to the room. Waiting for the host to start the game..."
                                            : "Connecting to the room..."}
                                    </p>
                                </div>

                                <button
                                    className="btn-danger"
                                    onClick={leaveRoom}
                                >
                                    Leave Room
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {gameState === "playing" && (
                    <div className="game-container h-full flex flex-col items-center justify-center">
                        <div className="relative">
                            <GameCanvas />
                            {!isHost && (
                                <div className="absolute inset-x-0 bottom-8">
                                    <GameControls />
                                </div>
                            )}
                        </div>

                        <div className="mt-6 w-full max-w-[800px]">
                            <PlayerList players={players} />
                        </div>
                    </div>
                )}

                {gameState === "ended" && (
                    <GameOver onRestart={resetGame} onExit={leaveRoom} />
                )}
            </div>
        </motion.div>
    );
};

export default GameScreen;
