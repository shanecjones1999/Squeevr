import { useEffect, useState } from 'react';
import Peer from 'peerjs';
import { nanoid } from 'nanoid';
import { useGameStore } from '../store/gameStore';
import { PeerMessage } from '../types';

export const usePeerConnection = () => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>('');
  const [connections, setConnections] = useState<Record<string, Peer.DataConnection>>({});
  const [isConnected, setIsConnected] = useState(false);
  
  const { 
    roomCode, 
    isHost, 
    playerName,
    addPlayer,
    removePlayer,
    updatePlayerState,
    startGame,
    endGame,
    gameState,
    localPlayerState
  } = useGameStore();
  
  // Initialize peer connection
  useEffect(() => {
    if (!roomCode) return;
    
    const id = nanoid();
    setPeerId(id);
    
    const newPeer = new Peer(isHost ? `host-${roomCode}` : id);
    
    newPeer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setPeer(newPeer);
      
      // If this is a player (not host), connect to the host
      if (!isHost) {
        const conn = newPeer.connect(`host-${roomCode}`);
        
        conn.on('open', () => {
          console.log('Connected to host');
          setIsConnected(true);
          
          // Send join message
          conn.send({
            type: 'join-room',
            senderId: id,
            data: { name: playerName }
          });
          
          // Add connection to state
          setConnections(prev => ({
            ...prev,
            'host': conn
          }));
        });
        
        conn.on('data', (data: PeerMessage) => {
          handlePeerMessage(data);
        });
        
        conn.on('close', () => {
          console.log('Disconnected from host');
          setIsConnected(false);
        });
      } else {
        // If host, add self to players
        addPlayer(id, 'Host');
        setIsConnected(true);
      }
    });
    
    // Host: handle incoming connections
    if (isHost) {
      newPeer.on('connection', (conn) => {
        console.log('New connection from:', conn.peer);
        
        conn.on('open', () => {
          // Add connection to state
          setConnections(prev => ({
            ...prev,
            [conn.peer]: conn
          }));
          
          // Send current game state to new player
          conn.send({
            type: 'game-update',
            senderId: peerId,
            data: { gameState, players: useGameStore.getState().players }
          });
        });
        
        conn.on('data', (data: PeerMessage) => {
          handlePeerMessage(data, conn);
        });
        
        conn.on('close', () => {
          console.log('Connection closed:', conn.peer);
          
          // Remove player and connection
          removePlayer(conn.peer);
          setConnections(prev => {
            const newConnections = { ...prev };
            delete newConnections[conn.peer];
            return newConnections;
          });
          
          // Broadcast player left
          Object.values(connections).forEach(c => {
            if (c.open && c !== conn) {
              c.send({
                type: 'player-left',
                senderId: peerId,
                data: { playerId: conn.peer }
              });
            }
          });
        });
      });
    }
    
    return () => {
      if (newPeer) {
        newPeer.destroy();
      }
      setConnections({});
      setPeer(null);
      setIsConnected(false);
    };
  }, [roomCode, isHost, playerName]);
  
  // Handle peer messages
  const handlePeerMessage = (message: PeerMessage, conn?: Peer.DataConnection) => {
    switch (message.type) {
      case 'join-room':
        if (isHost) {
          const { name } = message.data;
          const playerId = message.senderId;
          
          // Add player
          addPlayer(playerId, name);
          
          // Broadcast new player to all clients
          Object.values(connections).forEach(c => {
            if (c.open && c !== conn) {
              c.send({
                type: 'player-joined',
                senderId: peerId,
                data: { 
                  player: { 
                    id: playerId, 
                    name, 
                    color: useGameStore.getState().players.find(p => p.id === playerId)?.color 
                  } 
                }
              });
            }
          });
        }
        break;
        
      case 'player-joined':
        if (!isHost) {
          const { player } = message.data;
          addPlayer(player.id, player.name);
        }
        break;
        
      case 'player-left':
        if (!isHost) {
          const { playerId } = message.data;
          removePlayer(playerId);
        }
        break;
        
      case 'game-start':
        if (!isHost) {
          startGame();
        }
        break;
        
      case 'game-update':
        // Update game state from host
        break;
        
      case 'player-update':
        // Update player state (position, direction, etc.)
        if (isHost) {
          const { playerId, state } = message.data;
          updatePlayerState(playerId, state);
          
          // Broadcast to all clients
          Object.values(connections).forEach(c => {
            if (c.open && c !== conn) {
              c.send({
                type: 'player-update',
                senderId: peerId,
                data: { playerId, state }
              });
            }
          });
        } else {
          const { playerId, state } = message.data;
          updatePlayerState(playerId, state);
        }
        break;
        
      case 'game-over':
        if (!isHost) {
          const { winnerId } = message.data;
          endGame(winnerId);
        }
        break;
    }
  };
  
  // Send message to all connections
  const sendMessage = (message: PeerMessage) => {
    if (!peer || !isConnected) return;
    
    if (isHost) {
      // Host: send to all connections
      Object.values(connections).forEach(conn => {
        if (conn.open) {
          conn.send(message);
        }
      });
    } else {
      // Player: send to host
      const hostConn = connections['host'];
      if (hostConn && hostConn.open) {
        hostConn.send(message);
      }
    }
  };
  
  // Send player state update
  useEffect(() => {
    if (!peer || !isConnected || !localPlayerState) return;
    
    // Only send update if we're a player (not host)
    if (!isHost) {
      sendMessage({
        type: 'player-update',
        senderId: peerId,
        data: {
          playerId: peerId,
          state: localPlayerState
        }
      });
    }
  }, [localPlayerState, isConnected]);
  
  // Host: broadcast game start
  useEffect(() => {
    if (!peer || !isConnected || !isHost) return;
    
    if (gameState === 'playing') {
      sendMessage({
        type: 'game-start',
        senderId: peerId,
        data: {}
      });
    }
  }, [gameState, isConnected, isHost]);
  
  return {
    peer,
    peerId,
    isConnected,
    sendMessage
  };
};