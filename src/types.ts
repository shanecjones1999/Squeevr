// Game types
export type GameScreen = 'home' | 'create-room' | 'join-room' | 'game';
export type GameState = 'waiting' | 'playing' | 'ended';

// Player types
export interface Player {
  id: string;
  name: string;
  color: string;
}

export interface PlayerState {
  x: number;
  y: number;
  angle: number;
  speed: number;
  isAlive: boolean;
  color: string;
  points: { x: number; y: number }[];
  turning: 'left' | 'right' | null;
}

// Peer message types
export type MessageType = 
  | 'join-room'
  | 'player-joined'
  | 'player-left'
  | 'game-start'
  | 'game-update'
  | 'player-update'
  | 'game-over';

export interface PeerMessage {
  type: MessageType;
  senderId: string;
  data: any;
}