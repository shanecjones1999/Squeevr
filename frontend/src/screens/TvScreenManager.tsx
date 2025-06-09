import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import GameCanvas from "../components/game/GameCanvas";
import PlayerList from "../components/game/PlayerList";
import CreateRoomScreen from "./CreateRoomScreen";
import LoadingAnimation from "../components/game/LoadingAnimation";
import { usePeerConnection } from "../hooks/usePeerConnection";
import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";

const TvScreenManager: React.FC = () => {
    const { gameState, players, clientId } = useGameStore();
    const { isConnected, websocket } = usePeerConnection(clientId);

    const playerList = useMemo(() => Object.values(players), [players]);

    return (
        <>
            <AnimatePresence mode="wait">
                {gameState.isLoading && (
                    <LoadingAnimation message="Preparing game..." />
                )}
            </AnimatePresence>

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
                        className="w-full mx-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="game-container h-full flex flex-row items-center justify-center gap-6">
                            {/* Player List - Constrained width */}
                            <div className="w-1/4 max-w-[800px]">
                                <PlayerList players={players} />
                            </div>

                            {/* Game Canvas Container - Fixed size to prevent jumping */}
                            <div className="relative w-3/4">
                                <GameCanvas players={playerList} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TvScreenManager;
