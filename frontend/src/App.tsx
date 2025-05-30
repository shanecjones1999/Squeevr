import React from "react";
import { AnimatePresence } from "framer-motion";
import { useGameStore } from "./store/gameStore";
import HomeScreen from "./screens/HomeScreen";
import CreateRoomScreen from "./screens/CreateRoomScreen";
import JoinRoomScreen from "./screens/JoinRoomScreen";
import GameScreen from "./screens/GameScreen";
import GameLayout from "./components/layout/GameLayout";

function App() {
    const { currentScreen } = useGameStore();

    return (
        <GameLayout>
            <AnimatePresence mode="wait">
                {currentScreen === "home" && <HomeScreen key="home" />}
                {currentScreen === "create-room" && (
                    <CreateRoomScreen key="create-room" />
                )}
                {currentScreen === "join-room" && (
                    <JoinRoomScreen key="join-room" />
                )}
                {currentScreen === "game" && <GameScreen key="game" />}
            </AnimatePresence>
        </GameLayout>
    );
}

export default App;
