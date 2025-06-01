import React from "react";
import { AnimatePresence } from "framer-motion";
import { useGameStore } from "./store/gameStore";
import HomeScreen from "./screens/HomeScreen";
import JoinRoomScreen from "./screens/JoinRoomScreen";
import GameLayout from "./components/layout/GameLayout";
import PlayerGameScreen from "./screens/PlayerGameScreen";
import TvScreenManager from "./screens/TvScreenManager";

function App() {
    const { currentScreen } = useGameStore();

    return (
        <GameLayout>
            <AnimatePresence mode="wait">
                {currentScreen === "home" && <HomeScreen key="home" />}
                {currentScreen === "create-room" && (
                    <TvScreenManager key="create-room" />
                )}
                {currentScreen === "join-room" && (
                    <JoinRoomScreen key="join-room" />
                )}
                {currentScreen === "player-screen" && (
                    <PlayerGameScreen key="player-screen" />
                )}
            </AnimatePresence>
        </GameLayout>
    );
}

export default App;