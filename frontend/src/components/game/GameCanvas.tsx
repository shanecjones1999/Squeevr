import React, { useEffect, useRef } from "react";
import { useGameStore } from "../../store/gameStore";
import Player from "../../models/player";
import { AnimatePresence } from "framer-motion";
import CountdownTransition from "./CountdownTransition";

interface GameCanvasProps {
    players: Player[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ players }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const { playerStates, gameState } = useGameStore();

    // Persist playerStates in a ref to avoid re-renders
    const playerStatesRef = useRef(playerStates);
    useEffect(() => {
        playerStatesRef.current = playerStates;
    }, [playerStates]);

    // Set canvas dimensions immediately when component mounts
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas dimensions immediately to prevent size jumping
        canvas.width = 800;
        canvas.height = 800;

        // Set canvas style dimensions to match
        canvas.style.width = "800px";
        canvas.style.height = "800px";
    }, []); // Run only once on mount

    useEffect(() => {
        const canvas = canvasRef.current;
        if (
            !canvas ||
            gameState.status !== "playing" ||
            gameState.countdown > 0
        )
            return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const renderLoop = () => {
            // Clear canvas
            ctx.fillStyle = "#1f2937"; // Gray-800
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw border
            ctx.strokeStyle = "#374151"; // Gray-700
            ctx.lineWidth = 4;
            ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

            // Draw player trails
            players.forEach((player) => {
                const playerState = playerStatesRef.current[player.id];
                if (!playerState) return;

                player.draw(ctx);
            });

            animationRef.current = requestAnimationFrame(renderLoop);
        };

        animationRef.current = requestAnimationFrame(renderLoop);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [gameState, players]);

    return (
        <div className="relative w-[800px] h-[800px] mx-auto flex items-center justify-center">
            <AnimatePresence mode="wait">
                {gameState.countdown > 0 && (
                    <CountdownTransition countdown={gameState.countdown} />
                )}
            </AnimatePresence>

            <canvas
                ref={canvasRef}
                width={800}
                height={800}
                className="bg-gray-800 rounded-lg shadow-xl w-full h-full"
                style={{
                    width: "800px",
                    height: "800px",
                    display: "block", // Prevent inline spacing issues
                }}
            />
        </div>
    );
};

export default GameCanvas;
