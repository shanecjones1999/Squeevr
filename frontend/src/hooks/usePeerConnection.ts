import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const usePeerConnection = (clientId: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const {
    roomCode,
    isHost,
    playerName,
  } = useGameStore();

  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  // Initialize websocket connection
  useEffect(() => {
    if (!roomCode || !clientId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws?room_code=${roomCode}&client_type=${isHost ? 'host' : 'player'}&client_id=${clientId}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event.data);
      // Handle incoming messages here
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
