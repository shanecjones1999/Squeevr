import React, { useEffect, useRef } from "react";
import { useGameStore } from "../../store/gameStore";
import { Player } from "../../types";

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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || gameState.status !== "playing" || gameState.countdown > 0) return;

        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const renderLoop = () => {
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

                player.draw(ctx, playerState);
            });

            animationRef.current = requestAnimationFrame(renderLoop);
        };

        animationRef.current = requestAnimationFrame(renderLoop);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [gameState, players]); // run only on game start or player list change

    return (
        <div className="relative w-[800px] h-[800px] mx-auto">
            <canvas
                ref={canvasRef}
                className="bg-gray-800 rounded-lg shadow-xl"
            />
        </div>
    );
};

export default GameCanvas;