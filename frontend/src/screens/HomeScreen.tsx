import React from 'react';
import { motion } from 'framer-motion';
import { Squirrel, Users } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const HomeScreen: React.FC = () => {
  const { setScreen, createRoom } = useGameStore();
  
  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 1.5,
              ease: "easeInOut" 
            }}
          >
            <Squirrel className="h-16 w-16 text-indigo-500 mb-4 neon-glow" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Squeevr
          </h1>
          <p className="text-gray-400 text-center mb-4">
            A multiplayer line game
          </p>
          
          <div className="w-full border-t border-gray-700 my-4"></div>
          
          <div className="flex flex-col w-full gap-4">
            <button 
              className="btn-primary flex items-center justify-center gap-2"
              onClick={createRoom}
            >
              <Users size={20} />
              Create Room
            </button>
            
            <button 
              className="btn-secondary"
              onClick={() => setScreen('join-room')}
            >
              Join Room
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-400">
          <h3 className="font-semibold text-gray-300 mb-2">How to Play:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Create a room or join an existing one</li>
            <li>Each player controls a continuously moving line</li>
            <li>Use left/right controls to change direction</li>
            <li>Avoid hitting walls and other players' lines</li>
            <li>Last player standing wins!</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeScreen;