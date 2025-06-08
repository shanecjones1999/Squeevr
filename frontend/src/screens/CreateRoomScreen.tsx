import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, ArrowLeft, Play, UserPlus } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import PlayerList from "../components/game/PlayerList";
import { GameScreen } from "../types";

interface CreateRoomScreenProps {
    websocket: WebSocket | null;
    isConnected: boolean;
}

const CreateRoomScreen: React.FC<CreateRoomScreenProps> = ({
    websocket,
    isConnected,
}) => {
    const { roomCode, players, clientId, setScreen, startGame, setGameLoading, gameState } =
        useGameStore();
    const [copied, setCopied] = useState(false);

    const copyRoomCode = () => {
        if (roomCode) {
            navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleStartGame = () => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            setGameLoading(true); // Set loading state
            websocket.send(JSON.stringify({ type: "start_game" }));
            startGame();
        }
    };

    return (
        <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <button
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={() => setScreen("home" as GameScreen)}
                        disabled={gameState.isLoading}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-center">
                        Room Setup
                    </h2>
                    <div className="w-6"></div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400">Room Code:</p>
                        <p className="text-xl font-mono font-bold text-white tracking-wider">
                            {roomCode}
                        </p>
                    </div>
                    <button
                        className="btn-secondary py-2 px-3 flex items-center gap-1"
                        onClick={copyRoomCode}
                        title="Copy Room Code"
                        disabled={gameState.isLoading}
                    >
                        <Copy size={16} />
                        <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-300">Players</h3>
                        <span className="text-sm text-gray-400">
                            {Object.keys(players).length} joined
                        </span>
                    </div>

                    {Object.keys(players).length === 0 ? (
                        <div className="bg-gray-900 rounded-lg p-6 text-center text-gray-400 border border-gray-700 border-dashed flex flex-col items-center gap-2">
                            <UserPlus size={24} className="text-gray-500" />
                            <p>Waiting for players to join...</p>
                            <p className="text-sm">
                                Share the room code with friends
                            </p>
                        </div>
                    ) : (
                        <PlayerList players={players} />
                    )}
                </div>

                <div className="flex gap-4">
                    <motion.button
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                        disabled={
                            Object.keys(players).length < 1 || !isConnected || gameState.isLoading
                        }
                        onClick={handleStartGame}
                        whileTap={{ scale: 0.98 }}
                        animate={gameState.isLoading ? { opacity: 0.7 } : { opacity: 1 }}
                    >
                        {gameState.isLoading ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    <Play size={20} />
                                </motion.div>
                                Starting...
                            </>
                        ) : (
                            <>
                                <Play size={20} />
                                Start Game ({Object.keys(players).length})
                            </>
                        )}
                    </motion.button>
                </div>

                {clientId === null && (
                    <p className="text-amber-400 text-sm mt-4 text-center">
                        Establishing connection... Please wait.
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default CreateRoomScreen;