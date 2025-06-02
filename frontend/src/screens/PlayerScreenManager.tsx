import React from "react";
import { useGameStore } from "../store/gameStore";
import PlayerGameScreen from "./PlayerGameScreen";
import { usePeerConnection } from "../hooks/usePeerConnection";
import GameControls from "../components/game/GameControls";
import CountdownTransition from "../components/game/CountdownTransition";

const PlayerScreenManager: React.FC = () => {
    const { clientId, gameState } = useGameStore();
    const { websocket } = usePeerConnection(clientId);

    return (
        <>
            {gameState.status === "playing" ? (
                <div className="relative h-full">
                    <CountdownTransition countdown={gameState.countdown} />
                    <GameControls websocket={websocket} />
                </div>
            ) : (
                <PlayerGameScreen />
            )}
        </>
    );
};

export default PlayerScreenManager;
