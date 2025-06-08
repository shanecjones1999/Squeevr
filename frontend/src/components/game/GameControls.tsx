import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGameStore } from "../../store/gameStore";

interface GameControlsProps {
    websocket: WebSocket | null;
}

const GameControls: React.FC<GameControlsProps> = ({ websocket }) => {
    const { setLocalPlayerDirection } = useGameStore();
    const [isLeftPressed, setIsLeftPressed] = useState(false);
    const [isRightPressed, setIsRightPressed] = useState(false);

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
            if (e.repeat) return;
            if (e.key === "ArrowLeft" || e.key === "a") {
                heldDirections.current.left = true;
                setIsLeftPressed(true);
                updateDirection();
            } else if (e.key === "ArrowRight" || e.key === "d") {
                heldDirections.current.right = true;
                setIsRightPressed(true);
                updateDirection();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" || e.key === "a") {
                heldDirections.current.left = false;
                setIsLeftPressed(false);
                updateDirection();
            } else if (e.key === "ArrowRight" || e.key === "d") {
                heldDirections.current.right = false;
                setIsRightPressed(false);
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

    const handleTouchStart = (direction: "left" | "right") => {
        heldDirections.current[direction] = true;
        if (direction === "left") setIsLeftPressed(true);
        if (direction === "right") setIsRightPressed(true);
        updateDirection();
    };

    const handleTouchEnd = (direction: "left" | "right") => {
        heldDirections.current[direction] = false;
        if (direction === "left") setIsLeftPressed(false);
        if (direction === "right") setIsRightPressed(false);
        updateDirection();
    };

    const pressedStyle = {
        scale: 0.9,
        backgroundColor: "rgba(79, 70, 229, 0.4)",
    };

    return (
        <div className="flex justify-center gap-8 px-4">
            <motion.button
                className="w-32 h-32 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center touch-none"
                animate={
                    isLeftPressed
                        ? pressedStyle
                        : { scale: 1, backgroundColor: "rgba(31, 41, 55, 0.8)" }
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onTouchStart={() => handleTouchStart("left")}
                onTouchEnd={() => handleTouchEnd("left")}
                onMouseDown={() => handleTouchStart("left")}
                onMouseUp={() => handleTouchEnd("left")}
                onMouseLeave={() => handleTouchEnd("left")}
            >
                <ArrowLeft size={32} className="text-white" />
            </motion.button>

            <motion.button
                className="w-32 h-32 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center touch-none"
                animate={
                    isRightPressed
                        ? pressedStyle
                        : { scale: 1, backgroundColor: "rgba(31, 41, 55, 0.8)" }
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
