import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import GameCanvas from "../components/game/GameCanvas";
import PlayerList from "../components/game/PlayerList";
import CreateRoomScreen from "./CreateRoomScreen";
import { usePeerConnection } from "../hooks/usePeerConnection";
import { useMemo } from "react";
import CountdownTransition from "../components/game/CountdownTransition";
import { AnimatePresence } from "framer-motion";

const TvScreenManager: React.FC = () => {
    const { gameState, players, clientId } = useGameStore();
    const { isConnected, websocket } = usePeerConnection(clientId);

    const playerList = useMemo(() => Object.values(players), [players]);

    return (
        <AnimatePresence mode="wait">
            {gameState.status !== "playing" && (
                <motion.div
                    key="create-room"
                    className="w-full max-w-lg mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <CreateRoomScreen
                        websocket={websocket}
                        isConnected={isConnected}
                    />
                </motion.div>
            )}

            {gameState.status === "playing" && (
                <motion.div
                    key="game-ui"
                    className="w-full max-w-lg mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="game-container h-full flex flex-col items-center justify-center">
                        <CountdownTransition countdown={gameState.countdown} />
                        <div className="relative">
                            <GameCanvas players={playerList} />
                        </div>
                        <div className="mt-6 w-full max-w-[800px]">
                            <PlayerList players={players} />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TvScreenManager;
