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
            if (!isHost) {
                ws.send(JSON.stringify({ type: "join", name: playerName }));
            }
        };

        ws.onmessage = (event) => {
            console.log("Received message:", event.data);
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
                    console.log("game update!");
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
    };
};
