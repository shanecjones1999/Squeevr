import React, { useEffect, useRef } from "react";
import { useGameStore } from "../../store/gameStore";

const GameCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { playerStates, players, gameState } = useGameStore();

    // Set fixed canvas size
    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = 800;
            canvasRef.current.height = 800;
        }
    }, []);

    // Render game state
    useEffect(() => {
        if (!canvasRef.current || gameState !== "playing") return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = "#1f2937"; // Gray-800
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw border
        ctx.strokeStyle = "#374151"; // Gray-700
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

        // Draw player trails
        Object.entries(playerStates).forEach(([playerId, playerState]) => {
            const player = players[playerId];
            if (!player) return;

            // Draw trail
            ctx.strokeStyle = player.color;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            const points = playerState.points;
            if (points.length < 2) return;

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.stroke();

            // Draw player head if alive
            if (playerState.isAlive) {
                ctx.fillStyle = player.color;
                ctx.beginPath();
                ctx.arc(playerState.x, playerState.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }, [playerStates, players, gameState]);

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
