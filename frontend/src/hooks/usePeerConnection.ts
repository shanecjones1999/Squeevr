import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

export const usePeerConnection = () => {
    const [isConnected, setIsConnected] = useState(false);
    const { roomCode, isHost, playerName, clientId, updatePlayerState } = useGameStore();
    const [websocket, setWebsocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (!roomCode || !clientId || websocket?.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(
            `ws://localhost:8000/ws/${roomCode}/${
                isHost ? "tv" : "player"
            }/${clientId}`
        );

        ws.onopen = () => {
            console.log("Connected to WebSocket server");
            setIsConnected(true);
            if (!isHost) {
                ws.send(JSON.stringify({ type: "join", name: playerName }));
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "lobby") {
                    const {
                        addPlayer,
                        removePlayer,
                        players: currentPlayers,
                    } = useGameStore.getState();
                    const playersObject = data.players;
                    const newPlayers = Object.values(playersObject);

                    // Remove players that are not in the new list
                    Object.values(currentPlayers).forEach((player) => {
                        if (!newPlayers.find((p: any) => p.id === player.id)) {
                            removePlayer(player.id);
                        }
                    });

                    // Add players that are in the new list but not in the current list
                    newPlayers.forEach((player: any) => {
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
                    Object.entries(data.players).forEach(([playerId, playerData]: [string, any]) => {
                        updatePlayerState(playerId, {
                            x: playerData.x,
                            y: playerData.y,
                            isAlive: !playerData.eliminated,
                            points: playerData.trail || []
                        });
                    });
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket server");
            setIsConnected(false);
            setWebsocket(null);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        setWebsocket(ws);

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [roomCode, isHost, playerName, clientId]);

    const sendMessage = (message: any) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not connected");
        }
    };

    return {
        isConnected,
        sendMessage,
        websocket,
    };
};