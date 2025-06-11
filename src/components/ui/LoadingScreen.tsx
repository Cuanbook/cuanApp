import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Memuat...' }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-[#FAFAFA] bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg"
        >
          <div className="relative w-12 h-12">
            {/* Outer spinning circle */}
            <motion.div
              className="absolute inset-0 border-4 border-[#54D12B]/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner spinning circle */}
            <motion.div
              className="absolute inset-0 border-4 border-t-4 border-[#54D12B] rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#111611] font-inter font-medium text-sm"
          >
            {message}
          </motion.span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen; 