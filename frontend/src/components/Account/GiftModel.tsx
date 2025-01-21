import { motion } from 'framer-motion';
import { BiRupee } from 'react-icons/bi';

const GiftModel = ({ amount }: { amount: number }) => {
  return (
    <div className="flex justify-center items-center h-screen w-screen fixed inset-0 bg-black/50 z-50">
      <div className="relative w-[400px]">
        {/* Explosive Tada Background Effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 1.2],
            opacity: [0.8, 0.5, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="absolute -inset-10 bg-yellow-300/30 rounded-full blur-xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.3, 1],
            opacity: [0.6, 0.3, 0],
            rotate: [0, -360]
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.2
          }}
          className="absolute -inset-8 bg-green-300/30 rounded-full blur-xl"
        />
        
        {/* White Modal Container */}
        <div className="bg-white p-6 rounded-lg text-center relative z-10">
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20
            }}
            className="flex justify-center items-center mb-4"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="100" 
              height="100" 
              viewBox="0 0 100 100"
              className="text-green-500"
            >
              <motion.path
                d="M20 50 L40 70 L80 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                  ease: "easeInOut"
                }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: ["0 100", "100 100"] }}
                transition={{
                  duration: 0.7,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </motion.div>
          
          <p className="text-lg mb-2">Money Added to Account</p>
          <div className="text-3xl font-bold text-black">
            INR {amount / 100}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftModel;