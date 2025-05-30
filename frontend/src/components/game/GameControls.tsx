import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const GameControls: React.FC = () => {
  const { setLocalPlayerDirection } = useGameStore();
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setLocalPlayerDirection('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setLocalPlayerDirection('right');
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        (e.key === 'ArrowLeft' || e.key === 'a' || 
         e.key === 'ArrowRight' || e.key === 'd')
      ) {
        setLocalPlayerDirection(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setLocalPlayerDirection]);
  
  // Touch handlers for mobile controls
  const handleTouchStart = (direction: 'left' | 'right') => {
    setLocalPlayerDirection(direction);
  };
  
  const handleTouchEnd = () => {
    setLocalPlayerDirection(null);
  };
  
  return (
    <div className="flex justify-center gap-8 px-4">
      <motion.button
        className="w-20 h-20 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center touch-none"
        whileTap={{ scale: 0.9, backgroundColor: 'rgba(79, 70, 229, 0.4)' }}
        onTouchStart={() => handleTouchStart('left')}
        onTouchEnd={handleTouchEnd}
        onMouseDown={() => handleTouchStart('left')}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <ArrowLeft size={32} className="text-white" />
      </motion.button>
      
      <motion.button
        className="w-20 h-20 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center touch-none"
        whileTap={{ scale: 0.9, backgroundColor: 'rgba(79, 70, 229, 0.4)' }}
        onTouchStart={() => handleTouchStart('right')}
        onTouchEnd={handleTouchEnd}
        onMouseDown={() => handleTouchStart('right')}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <ArrowRight size={32} className="text-white" />
      </motion.button>
    </div>
  );
};

export default GameControls;