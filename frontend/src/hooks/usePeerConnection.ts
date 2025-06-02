import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

export const usePeerConnection = (clientId: string | null) => {
    const [isConnected, setIsConnected] = useState(false);
    const { roomCode, isHost, playerName } = useGameStore();

    const [websocket, setWebsocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!roomCode || !clientId) return;

        const ws = new WebSocket(
            `ws://localhost:8000/ws/${roomCode}/${
                isHost ? "tv" : "player"
            }/${clientId}`
        );

        ws.onopen = () => {
            console.log("Connected to WebSocket server");
            setIsConnected(true);
            if (playerName != "Host") {
                ws.send(JSON.stringify({ type: "join", name: playerName }));
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "lobby") {
                    console.log("Lobby update:", data.players);
                    // Update players in gameStore
                    const {
                        addPlayer,
                        removePlayer,
                        players: currentPlayers,
                    } = useGameStore.getState();
                    const playersObject = data.players;
                    const newPlayers = Object.values(playersObject) as {
                        id: string;
                        name: string;
                    }[];

                    // Remove players that are not in the new list
                    Object.values(currentPlayers).forEach((player) => {
                        if (!newPlayers.find((p) => p.id === player.id)) {
                            removePlayer(player.id);
                        }
                    });

                    // Add players that are in the new list but not in the current list
                    newPlayers.forEach((player) => {
                        if (
                            !Object.values(currentPlayers).find(
                                (p) => p.id === player.id
                            )
                        ) {
                            addPlayer(player.id, player.name);
                        }
                    });
                } else if (data.type === "game_update") {
                    // Update game state
                    const { updatePlayerState, updateGameState } =
                        useGameStore.getState();
                    Object.entries(data.players).forEach(
                        ([playerId, playerData]) => {
                            const { x, y, eliminated, floating, radius } =
                                playerData as {
                                    x: number;
                                    y: number;
                                    eliminated: boolean;
                                    floating: boolean;
                                    radius: number;
                                };
                            updatePlayerState(playerId, {
                                x: x,
                                y: y,
                                isAlive: !eliminated,
                                floating,
                                radius,
                            });
                        },
                        updateGameState({ status: data.status })
                    );
                } else if (data.type === "reset_round") {
                    const { resetAllPlayerPoints } = useGameStore.getState();
                    resetAllPlayerPoints();
                } else if (data.type === "player_state_update") {
                    const {
                        gameStarted,
                        eliminated,
                        gameStarting,
                        countdown,
                        color,
                        status,
                    } = data.playerState;
                    const { updateGameState } = useGameStore.getState();
                    updateGameState({
                        gameStarted,
                        eliminated,
                        gameStarting,
                        countdown,
                        color,
                        status,
                    });
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket server");
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        setWebsocket(ws);

        return () => {
            ws.close();
        };
    }, [roomCode, isHost, playerName, clientId]);

    const sendMessage = (message: string) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(message);
        } else {
            console.error("WebSocket is not connected");
        }
    };

    return {
        isConnected,
        sendMessage,
        websocket: websocket,
    };
};
