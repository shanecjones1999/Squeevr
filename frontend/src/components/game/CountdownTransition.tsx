import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTransitionProps {
    countdown: number;
}

const CountdownTransition: React.FC<CountdownTransitionProps> = ({ countdown }) => {
    if (countdown === 0) return null;

    const colors = {
        3: 'rgb(239, 68, 68)', // red
        2: 'rgb(234, 179, 8)', // yellow
        1: 'rgb(34, 197, 94)', // green
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <motion.div
                    key={countdown}
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ 
                        scale: [2, 1, 1.2],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 1,
                        times: [0, 0.3, 1],
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    <motion.div
                        className="absolute inset-0 rounded-full blur-2xl"
                        style={{ 
                            backgroundColor: colors[countdown as keyof typeof colors],
                            opacity: 0.3
                        }}
                        animate={{
                            scale: [1, 1.5],
                            opacity: [0.3, 0]
                        }}
                        transition={{
                            duration: 1,
                            ease: "easeOut",
                            times: [0, 1]
                        }}
                    />
                    <span 
                        className="text-8xl font-bold"
                        style={{ 
                            color: colors[countdown as keyof typeof colors]
                        }}
                    >
                        {countdown}
                    </span>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CountdownTransition;