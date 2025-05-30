import React, { ReactNode } from 'react';
import { Squirrel, Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameLayoutProps {
  children: ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col">
      <header className="p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2 neon-glow"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Squirrel className="h-8 w-8 text-indigo-500" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Squeevr
            </h1>
          </motion.div>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Github size={20} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
        {children}
      </main>
      
      <footer className="p-4 border-t border-gray-800 text-center text-gray-500 text-sm">
        <div className="container mx-auto">
          <p>© 2025 Squeevr - A Multiplayer Line Game</p>
        </div>
      </footer>
    </div>
  );
};

export default GameLayout;