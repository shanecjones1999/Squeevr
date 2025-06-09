import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Player from "../../models/player";

interface PlayerListProps {
    players: Record<string, Player>;
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-800">
                <AnimatePresence mode="wait">
                    {Object.values(players).map((player, index) => (
                        <motion.li
                            key={player.id}
                            className="flex items-center py-3 px-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <div
                                className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                                style={{ backgroundColor: player.color }}
                            />
                            <span className="text-white">{player.name}</span>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
};

export default PlayerList;
