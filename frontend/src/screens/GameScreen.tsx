import React from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import GameOver from "../components/game/GameOver";
// import { usePeerConnection } fro "../hooks/usePeerConnection";
import PlayerGameScreen from "./PlayerGameScreen";
import TvGameScreen from "./TvGameScreen";
import PlayerList from "../components/game/PlayerList";

const GameScreen: React.FC = () => {
    const {
        isHost,
        gameState,
        players,
        startGame,
        resetGame,
        leaveRoom,
        clientId,
    } = useGameStore();

    return (
        <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="h-full flex flex-col">
                {gameState.gameStarted && <TvGameScreen />}

                {gameState.eliminated && (
                    <GameOver onRestart={resetGame} onExit={leaveRoom} />
                )}
            </div>
        </motion.div>
    );
};

export default GameScreen;
