import React, { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGameStore } from "../../store/gameStore";

interface GameControlsProps {
    websocket: WebSocket | null;
}

const GameControls: React.FC<GameControlsProps> = ({ websocket }) => {
    const { setLocalPlayerDirection } = useGameStore();

    const heldDirections = useRef<{ left: boolean; right: boolean }>({
        left: false,
        right: false,
    });

    const sendDirection = useCallback(
        (direction: "left" | "right" | null) => {
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.send(
                    JSON.stringify({
                        type: "move",
                        state: {
                            left: direction === "left",
                            right: direction === "right",
                        },
                    })
                );
            }
            setLocalPlayerDirection(direction);
        },
        [websocket, setLocalPlayerDirection]
    );

    const updateDirection = useCallback(() => {
        const { left, right } = heldDirections.current;
        const direction = left ? "left" : right ? "right" : null;
        sendDirection(direction);
    }, [sendDirection]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "a") {
                heldDirections.current.left = true;
                updateDirection();
            } else if (e.key === "ArrowRight" || e.key === "d") {
                heldDirections.current.right = true;
                updateDirection();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "a") {
                heldDirections.current.left = false;
                updateDirection();
            } else if (e.key === "ArrowRight" || e.key === "d") {
                heldDirections.current.right = false;
                updateDirection();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [updateDirection]);

    // Touch handlers
    const handleTouchStart = (direction: "left" | "right") => {
        heldDirections.current[direction] = true;
        updateDirection();
    };

    const handleTouchEnd = (direction: "left" | "right") => {
        heldDirections.current[direction] = false;
        updateDirection();
    };

    return (
        <div className="flex justify-center gap-8 px-4">
            <motion.button
                className="w-20 h-20 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center touch-none"
                whileTap={{
                    scale: 0.9,
                    backgroundColor: "rgba(79, 70, 229, 0.4)",
                }}
                onTouchStart={() => handleTouchStart("left")}
                onTouchEnd={() => handleTouchEnd("left")}
                onMouseDown={() => handleTouchStart("left")}
                onMouseUp={() => handleTouchEnd("left")}
                onMouseLeave={() => handleTouchEnd("left")}
            >
                <ArrowLeft size={32} className="text-white" />
            </motion.button>

            <motion.button
                className="w-20 h-20 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center touch-none"
                whileTap={{
                    scale: 0.9,
                    backgroundColor: "rgba(79, 70, 229, 0.4)",
                }}
                onTouchStart={() => handleTouchStart("right")}
                onTouchEnd={() => handleTouchEnd("right")}
                onMouseDown={() => handleTouchStart("right")}
                onMouseUp={() => handleTouchEnd("right")}
                onMouseLeave={() => handleTouchEnd("right")}
            >
                <ArrowRight size={32} className="text-white" />
            </motion.button>
        </div>
    );
};

export default GameControls;
