import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import GameCanvas from "../components/game/GameCanvas";
import PlayerList from "../components/game/PlayerList";
import CreateRoomScreen from "./CreateRoomScreen";
import { usePeerConnection } from "../hooks/usePeerConnection";
import GameOver from "../components/game/GameOver";
import { useMemo } from "react";

const TvScreenManager: React.FC = () => {
    const { gameState, players, clientId, resetGame, leaveRoom } =
        useGameStore();
    const { isConnected, websocket } = usePeerConnection(clientId);

    const playerList = useMemo(() => Object.values(players), [players]);

    return (
        <motion.div
            className="w-full max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {gameState.status != "playing" && (
                <CreateRoomScreen
                    websocket={websocket}
                    isConnected={isConnected}
                    key="create-room"
                />
            )}
            {gameState.status === "playing" && (
                <div className="game-container h-full flex flex-col items-center justify-center">
                    <div className="relative">
                        <GameCanvas players={playerList} />
                    </div>

                    <div className="mt-6 w-full max-w-[800px]">
                        <PlayerList players={players} />
                    </div>
                </div>
            )}
            {gameState.eliminated && (
                <GameOver onRestart={resetGame} onExit={leaveRoom} />
            )}
        </motion.div>
    );
};

export default TvScreenManager;
