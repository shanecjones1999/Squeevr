import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn } from "lucide-react";
import { useGameStore } from "../store/gameStore";
// import { usePeerConnection } from "../hooks/usePeerConnection"; // Import usePeerConnection
import { GameScreen } from "../types";

const JoinRoomScreen: React.FC = () => {
    const { setScreen, joinRoom } = useGameStore();
    const [name, setName] = useState("");
    const [roomCode, setRoomCodeState] = useState("");
    const [error, setError] = useState("");

    // usePeerConnection(clientId); // Get sendMessage from usePeerConnection

    const handleJoin = async () => {
        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }

        if (!roomCode.trim()) {
            setError("Please enter a room code");
            return;
        }

        setError("");

        try {
            const response = await fetch(
                "http://localhost:8000/api/join_room",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        room_code: roomCode.toUpperCase(),
                        name: name,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                // Join room successful
                joinRoom(data.room_code, name, data.player_id);
                setScreen("player-screen" as GameScreen); // Navigate to player screen
            } else {
                // Join room failed
                setError(data.message || "Failed to join room");
            }
        } catch (error) {
            console.error("Failed to join room:", error);
            setError("Failed to join room");
        }
    };

    return (
        <motion.div
            className="w-full max-w-md"
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
                        Join Room
                    </h2>
                    <div className="w-6"></div> {/* Spacer for alignment */}
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="input w-full"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={15}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="roomCode"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Room Code
                        </label>
                        <input
                            type="text"
                            id="roomCode"
                            className="input w-full uppercase"
                            placeholder="Enter room code"
                            value={roomCode}
                            onChange={(e) => setRoomCodeState(e.target.value)}
                            maxLength={6}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <button
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    onClick={handleJoin}
                >
                    <LogIn size={20} />
                    Join Game
                </button>
            </div>
        </motion.div>
    );
};

export default JoinRoomScreen;
