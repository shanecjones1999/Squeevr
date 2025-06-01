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
        if (!canvas || !gameState.gameStarted) return;

        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const draw = (
            ctx: CanvasRenderingContext2D,
            width: number,
            height: number
        ) => {
            ctx.fillStyle = "#1f2937"; // Gray-800
            ctx.fillRect(0, 0, width, height);

            // Draw border
            ctx.strokeStyle = "#374151"; // Gray-700
            ctx.lineWidth = 4;
            ctx.strokeRect(2, 2, width - 4, height - 4);

            // Draw player trails
            players.forEach((player) => {
                const playerState = playerStatesRef.current[player.id];
                if (!playerState) return;

                ctx.fillStyle = player.color;
                ctx.beginPath();
                ctx.arc(playerState.x, playerState.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const renderLoop = () => {
            draw(ctx, canvas.width, canvas.height);
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
