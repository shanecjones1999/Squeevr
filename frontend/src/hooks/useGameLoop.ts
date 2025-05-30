import { useEffect, useState, useRef, RefObject } from "react";
import { useGameStore } from "../store/gameStore";
import { PlayerState } from "../types";

export const useGameLoop = (canvasRef?: RefObject<HTMLCanvasElement>) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const requestIdRef = useRef<number | null>(null);

    const {
        gameState,
        playerStates,
        updatePlayerState,
        canvasWidth,
        canvasHeight,
        endGame,
        isHost,
        players,
    } = useGameStore();

    // Initialize the game loop
    useEffect(() => {
        if (gameState !== "playing") return;

        setIsInitialized(true);

        // Get canvas dimensions if available
        let width = 800; // Fixed game area size
        let height = 800;

        // Initialize player positions if host
        if (isHost) {
            // Calculate starting positions in a circle
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.35;

            players.forEach((player, index) => {
                const angle = (index / players.length) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                const playerAngle = angle + Math.PI; // Face outward

                updatePlayerState(player.id, {
                    x,
                    y,
                    angle: playerAngle,
                    isAlive: true,
                    points: [{ x, y }],
                });
            });
        }

        // Main game loop
        const tick = (time: number) => {
            if (gameState !== "playing") {
                requestIdRef.current = null;
                return;
            }

            // Only update game logic if we're the host
            if (isHost) {
                // Update player positions
                const updatedStates = { ...playerStates };
                const turnSpeed = 0.08; // Radians per frame
                const moveSpeed = 3; // Pixels per frame
                let playersAlive = 0;
                let lastAlivePlayerId: string | null = null;

                Object.entries(updatedStates).forEach(([playerId, state]) => {
                    if (!state.isAlive) return;

                    playersAlive++;
                    lastAlivePlayerId = playerId;

                    // Update angle based on turning direction
                    let newAngle = state.angle;
                    if (state.turning === "left") {
                        newAngle -= turnSpeed;
                    } else if (state.turning === "right") {
                        newAngle += turnSpeed;
                    }

                    // Update position
                    const newX = state.x + Math.cos(newAngle) * moveSpeed;
                    const newY = state.y + Math.sin(newAngle) * moveSpeed;

                    // Check for wall collisions
                    if (
                        newX < 3 ||
                        newX > width - 3 ||
                        newY < 3 ||
                        newY > height - 3
                    ) {
                        updatedStates[playerId] = {
                            ...state,
                            isAlive: false,
                        };
                        playersAlive--;
                        return;
                    }

                    // Check for collisions with other player trails
                    let collision = false;

                    Object.entries(updatedStates).forEach(
                        ([otherPlayerId, otherState]) => {
                            if (collision) return;

                            const points = otherState.points;
                            if (points.length < 2) return;

                            // Skip recent points to avoid self-collision with head
                            const startIdx =
                                otherPlayerId === playerId ? 10 : 0;

                            for (let i = startIdx; i < points.length - 1; i++) {
                                const p1 = points[i];
                                const p2 = points[i + 1];

                                // Line segment collision check with player circle
                                const dist = pointToLineDistance(
                                    newX,
                                    newY,
                                    p1.x,
                                    p1.y,
                                    p2.x,
                                    p2.y
                                );

                                if (dist < 3) {
                                    // Player radius
                                    collision = true;
                                    break;
                                }
                            }
                        }
                    );

                    if (collision) {
                        updatedStates[playerId] = {
                            ...state,
                            isAlive: false,
                        };
                        playersAlive--;
                        return;
                    }

                    // Add new point for trail
                    const points = [...state.points];
                    points.push({ x: newX, y: newY });

                    // Limit trail length
                    if (points.length > 1000) {
                        points.shift();
                    }

                    // Update player state
                    updatedStates[playerId] = {
                        ...state,
                        x: newX,
                        y: newY,
                        angle: newAngle,
                        points,
                    };
                });

                // Check if game is over (0 or 1 player alive)
                if (playersAlive <= 1 && Object.keys(playerStates).length > 1) {
                    endGame(lastAlivePlayerId || undefined);
                    return;
                }

                // Update all player states
                Object.entries(updatedStates).forEach(([playerId, state]) => {
                    updatePlayerState(playerId, state);
                });
            }

            // Continue the game loop
            requestIdRef.current = requestAnimationFrame(tick);
        };

        // Start the game loop
        requestIdRef.current = requestAnimationFrame(tick);

        // Cleanup
        return () => {
            if (requestIdRef.current) {
                cancelAnimationFrame(requestIdRef.current);
                requestIdRef.current = null;
            }
        };
    }, [gameState, isHost]);

    return {
        isInitialized,
    };
};

// Helper function to calculate distance from point to line segment
function pointToLineDistance(
    x: number,
    y: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
): number {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
        param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;

    return Math.sqrt(dx * dx + dy * dy);
}
