// Game types
export type GameScreen =
    | "home"
    | "create-room"
    | "join-room"
    | "game"
    | "player-screen"
    | "tv";

export interface GameState {
    gameStarted: boolean;
    eliminated: boolean;
    gameStarting: boolean;
    countdown: number;
    color: string;
    status: string;
}

// Player types
export interface Player {
    id: string;
    name: string;
    color: string;
    draw: (ctx: CanvasRenderingContext2D, playerState: PlayerState) => void;
}

export interface PlayerState {
    x: number;
    y: number;
    angle: number;
    speed: number;
    isAlive: boolean;
    color: string;
    points: { x: number; y: number }[];
    turning: "left" | "right" | null;
    floating: boolean;
    radius: number;
}

// Peer message types
export type MessageType =
    | "join-room"
    | "player-joined"
    | "player-left"
    | "game-start"
    | "game-update"
    | "player-update"
    | "game-over";

export interface PeerMessage {
    type: MessageType;
    senderId: string;
    data: any;
}
