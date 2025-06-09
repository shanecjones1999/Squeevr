import React from "react";
import { useGameStore } from "../store/gameStore";
import PlayerGameScreen from "./PlayerGameScreen";
import { usePeerConnection } from "../hooks/usePeerConnection";
import GameControls from "../components/game/GameControls";

const PlayerScreenManager: React.FC = () => {
    const { clientId, gameState } = useGameStore();
    const { websocket } = usePeerConnection(clientId);

    return (
        <>
            {gameState.status === "playing" ? (
                <div className="relative h-full">
                    <GameControls websocket={websocket} />
                </div>
            ) : (
                <PlayerGameScreen />
            )}
        </>
    );
};

export default PlayerScreenManager;
