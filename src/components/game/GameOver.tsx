import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Home } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface GameOverProps {
  onRestart: () => void;
  onExit: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ onRestart, onExit }) => {
  const { players, playerStates } = useGameStore();
  
  // Find the winner (last player alive)
  const getWinner = () => {
    const alivePlayerId = Object.entries(playerStates)
      .find(([_, state]) => state.isAlive)?.[0];
    
    return players.find(player => player.id === alivePlayerId);
  };
  
  const winner = getWinner();
  
  return (
    <motion.div
      className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700 max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          className="mx-auto mb-6 w-20 h-20 rounded-full bg-indigo-900/50 flex items-center justify-center"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5 }}
        >
          <Trophy className="h-10 w-10 text-yellow-400" />
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
        
        {winner ? (
          <>
            <p className="text-xl mb-6">
              <span className="font-medium" style={{ color: winner.color }}>
                {winner.name}
              </span> wins!
            </p>
          </>
        ) : (
          <p className="text-xl mb-6">It's a tie!</p>
        )}
        
        <div className="flex gap-4 mt-8">
          <button
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            onClick={onRestart}
          >
            <RefreshCw size={18} />
            Play Again
          </button>
          
          <button
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
            onClick={onExit}
          >
            <Home size={18} />
            Exit
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameOver;