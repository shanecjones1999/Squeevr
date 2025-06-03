import { create } from "zustand";
import { GameState, PlayerState, GameScreen, PlayerUpdate } from "../types";
import Player from "../models/player";

interface GameStore {
    // Game state
    currentScreen: GameScreen;
    roomCode: string | null;
    isHost: boolean;
    playerName: string;
    clientId: string | null;
    players: Record<string, Player>;
    gameState: GameState;
    winner?: string;
    peerId?: string;

    // Game settings
    canvasWidth: number;
    canvasHeight: number;

    // Player state
    localPlayerState: PlayerState | null;
    playerStates: Record<string, PlayerState>;

    // Game actions
    setScreen: (screen: GameScreen) => void;
    setRoomCode: (code: string) => void;
    setPlayerName: (name: string) => void; // Add setPlayerName
    setClientId: (id: string) => void;
    createRoomProperties: (roomCode: string) => void;
    joinRoom: (code: string, name: string, clientId: string) => void;
    startGame: () => void;
    endGame: (winnerId?: string) => void;
    resetGame: () => void;
    leaveRoom: () => void;

    // Player actions
    addPlayer: (id: string, name: string) => void;
    removePlayer: (id: string) => void;
    updatePlayerState: (id: string, state: PlayerUpdate) => void;
    resetAllPlayerPoints: () => void;
    setLocalPlayerDirection: (direction: "left" | "right" | null) => void;
    updateGameState: (state: Partial<GameState>) => void;
}

const DEFAULT_PLAYER_STATE: PlayerState = {
    x: 0,
    y: 0,
    isAlive: true,
    color: "",
    points: [],
    turning: null,
    floating: false,
    radius: 4,
};

const defaultGameState: GameState = {
    gameStarted: false,
    eliminated: false,
    gameStarting: false,
    countdown: 0,
    color: "#FFFFFF",
    status: "lobby",
};

export const useGameStore = create<GameStore>((set, get) => ({
    // Game state
    currentScreen: "home",
    roomCode: null,
    isHost: false,
    playerName: "",
    clientId: null,
    players: {},
    gameState: defaultGameState,

    // Game settings
    canvasWidth: 800,
    canvasHeight: 600,

    // Player state
    localPlayerState: null,
    playerStates: {},

    // Game actions
    setScreen: (screen) => set({ currentScreen: screen }),
    setRoomCode: (code) => set({ roomCode: code }),
    setPlayerName: (name: string) => set({ playerName: name }), // Add setPlayerName
    setClientId: (id: string) => set({ clientId: id }),

    createRoomProperties: (roomCode: string) => {
        set({
            roomCode,
            isHost: true,
            currentScreen: "tv",
            gameState: defaultGameState,
            players: {},
            clientId: roomCode,
            playerName: "Host",
        });
    },

    joinRoom: (code: string, name: string, clientId: string) => {
        set({
            roomCode: code,
            isHost: false,
            playerName: name,
            currentScreen: "player-screen",
            gameState: defaultGameState,
            clientId,
        });
    },

    startGame: () => {
        set({
            gameState: {
                ...get().gameState,
                gameStarted: true,
            },
        });
    },

    endGame: (winnerId) => {
        set((state) => ({
            gameState: {
                ...state.gameState,
                eliminated: true,
            },
            winner: winnerId,
        }));
    },

    resetGame: () => {
        set({
            gameState: defaultGameState,
            playerStates: {},
            localPlayerState: null,
        });
    },

    leaveRoom: () => {
        set({
            currentScreen: "home",
            roomCode: null,
            isHost: false,
            playerName: "",
            players: {},
            gameState: defaultGameState,
            playerStates: {},
            localPlayerState: null,
        });
    },

    // Player actions
    addPlayer: (id, name) => {
        // Don't add the host as a player
        if (get().isHost && get().peerId && id === get().peerId) {
            return;
        }

        const { players } = get();
        const colors = [
            "#FF5E5B", // Red
            "#39E5B6", // Teal
            "#FFEC5C", // Yellow
            "#5CB9FF", // Blue
            "#FF9F68", // Orange
            "#B78AFF", // Purple
            "#5CFFA0", // Green
            "#FF5CE1", // Pink
        ];

        const playerColor = colors[Object.keys(players).length % colors.length];
        const newPlayer = new Player(id, name, playerColor); //{ id, name, color: playerColor, draw: drawPlayer };

        set((state) => ({
            players: {
                ...state.players,
                [id]: newPlayer,
            },
            playerStates: {
                ...get().playerStates,
                [id]: {
                    ...DEFAULT_PLAYER_STATE,
                    color: playerColor,
                    x: Math.random() * get().canvasWidth,
                    y: Math.random() * get().canvasHeight,
                    angle: Math.random() * Math.PI * 2,
                },
            },
        }));
    },

    removePlayer: (id) => {
        const { players, playerStates } = get();
        const newPlayerStates = { ...playerStates };
        delete newPlayerStates[id];

        const newPlayers = { ...players };
        delete newPlayers[id];

        set({
            players: newPlayers,
            playerStates: newPlayerStates,
        });
    },

    updatePlayerState: (id, state) => {
        const { players } = get();
        const player = players[id];

        if (!player) return;

        player.update(state);

        // Re-set the state with the same object reference to trigger updates
        set({ players: { ...players, [id]: player } });
    },

    resetAllPlayerPoints: () => {
        const { players } = get();

        // Call reset on each player (mutate in place)
        Object.values(players).forEach((player) => player.reset());

        // Re-set the state to trigger reactivity
        set({ players: { ...players } });
    },

    setLocalPlayerDirection: (direction) => {
        const { localPlayerState } = get();
        if (localPlayerState) {
            set({
                localPlayerState: {
                    ...localPlayerState,
                    turning: direction,
                },
            });
        }
    },

    updateGameState: (state) => {
        set({
            gameState: {
                ...get().gameState,
                ...state,
            },
        });
    },
}));
