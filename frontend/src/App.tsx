import React from "react";
import { AnimatePresence } from "framer-motion";
import { useGameStore } from "./store/gameStore";
import HomeScreen from "./screens/HomeScreen";
import JoinRoomScreen from "./screens/JoinRoomScreen";
import GameLayout from "./components/layout/GameLayout";
import PlayerScreenManager from "./screens/PlayerScreenManager";
import TvScreenManager from "./screens/TvScreenManager";

function App() {
    const { currentScreen } = useGameStore();

    return (
        <GameLayout>
            <AnimatePresence mode="wait">
                {currentScreen === "home" && <HomeScreen key="home" />}
                {currentScreen === "tv" && <TvScreenManager key="tv" />}
                {currentScreen === "join-room" && (
                    <JoinRoomScreen key="join-room" />
                )}
                {currentScreen === "player-screen" && (
                    <PlayerScreenManager key="player-screen" />
                )}
            </AnimatePresence>
        </GameLayout>
    );
}

export default App;
