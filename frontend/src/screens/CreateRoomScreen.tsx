import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, ArrowLeft, Play, UserPlus } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import PlayerList from "../components/game/PlayerList";
import { usePeerConnection } from "../hooks/usePeerConnection";
import { GameScreen } from "../types";

const CreateRoomScreen: React.FC = () => {
    const {
        setRoomCode,
        roomCode,
        players,
        setScreen,
        startGame,
        setPlayerName,
    } = useGameStore();
    const [copied, setCopied] = useState(false);
    const [clientId, setClientId] = useState<string | null>(null);

    useEffect(() => {
        const createRoom = async () => {
            try {
                // 1. Create the room
                const createRoomResponse = await fetch(
                    "http://localhost:8000/api/create_room",
                    {
                        method: "POST",
                    }
                );
                const createRoomData = await createRoomResponse.json();
                const newRoomCode = createRoomData.room_code;
                setRoomCode(newRoomCode);

                setClientId(newRoomCode);
                setPlayerName("Host");
            } catch (error) {
                console.error("Failed to create room:", error);
                // Handle error appropriately
            }
        };

        createRoom();
    }, [setRoomCode, setPlayerName, setScreen]);

    const { isConnected } = usePeerConnection(clientId);

    const copyRoomCode = () => {
        if (roomCode) {
            navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-center">
                        Room Setup
                    </h2>
                    <div className="w-6"></div> {/* Spacer for alignment */}
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
                    >
                        <Copy size={16} />
                        <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-300">Players</h3>
                        <span className="text-sm text-gray-400">
                            {players.length} joined
                        </span>
                    </div>

                    {players.length === 0 ? (
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
                    <button
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                        disabled={players.length < 2 || !isConnected}
                        onClick={() => startGame()}
                    >
                        <Play size={20} />
                        Start Game ({players.length}/2 players)
                    </button>
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
