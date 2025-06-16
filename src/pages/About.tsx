import { motion, AnimatePresence } from 'framer-motion';
import { FaGlobeAmericas, FaCloudSun, FaStar, FaFilter } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useState, useEffect, useRef } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Animated Text Cycle Component
interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      const elements = measureRef.current.children;
      if (elements.length > currentIndex) {
        const newWidth = elements[currentIndex].getBoundingClientRect().width;
        setWidth(`${newWidth}px`);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, words.length]);

  const containerVariants = {
    hidden: { 
      y: -20,
      opacity: 0,
      filter: "blur(8px)"
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      y: 20,
      opacity: 0,
      filter: "blur(8px)",
      transition: { 
        duration: 0.3, 
        ease: "easeIn"
      }
    },
  };

  return (
    <>
      <div 
        ref={measureRef} 
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {words.map((word, i) => (
          <span key={i} className={`font-bold ${className}`}>
            {word}
          </span>
        ))}
      </div>

      <motion.span 
        className="relative inline-block"
        animate={{ 
          width,
          transition: { 
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 1.2,
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentIndex}
            className={`inline-block font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: "nowrap" }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}

const About = () => {
  const destinations = [
    "Adventures",
    "Journeys", 
    "Experiences",
    "Memories",
    "Discoveries"
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen bg-gradient-to-b from-white to-blue-100 px-6 md:px-16 py-10 overflow-hidden font-sans"
    >
      {/* Optimized Background Animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2563eb] opacity-30 blur-[60px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <Navbar />

      {/* Subtitle with Animated Text Cycle */}
      <motion.p variants={itemVariants} className="text-center mb-5 mt-20 text-4xl text-gray-600 relative">
        Your AI companion for unforgettable{" "}
        <AnimatedTextCycle 
          words={destinations}
          interval={3000}
          className="text-blue-600"
        />
      </motion.p>

      <motion.div variants={itemVariants} className="mt-20 flex flex-col items-center relative">
        <div className="text-center leading-[0.9]">
          <span
            className="block text-center text-gray-900"
            style={{ fontSize: "7rem", fontWeight: 700 }}
          >
            Learn More
          </span>
          <span
            className="block text-center text-gray-900"
            style={{ fontSize: "7rem", fontWeight: 700 }}
          >
            About Us
          </span>
        </div>
      </motion.div> 

      <motion.div variants={itemVariants} className="mt-20 text-xl text-[#2563eb] relative font-semibold">
        <span style={{ fontSize: "1.5em", fontWeight: 650 }}>
          <span className="text-gray-900">GlobeTrekAI</span> transforms travel planning through AI-powered personalized itineraries tailored to your unique preferences and interests.
        </span>
        <br />
        <br />
        <span>
          Our intelligent platform analyzes thousands of <span className="text-gray-900">attractions</span>, <span className="text-gray-900">local insights</span>, and <span className="text-gray-900">travel patterns</span> to create optimized day-by-day schedules.
        </span>
        <span>
          <span className="text-gray-900">Save countless hours</span> of research as our technology handles the complex logistics of trip planning while you focus on the excitement of discovery.

          Whether exploring bustling cities or serene landscapes, GlobeTrekAI ensures you experience the perfect balance of <span className="text-gray-900">iconic landmarks</span> and <span className="text-gray-900">hidden gems</span>.
        </span>
      </motion.div>

      {/* CTA Button */}
      <motion.div variants={itemVariants} className="mt-10 flex justify-center relative">
        {/* Subtle glow effect behind button */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <div className="absolute w-40 h-12 bg-blue-400/30 rounded-full blur-xl" />
        </div>
        
        {/* Enhanced button with better animations and styling */}
        <motion.a
          href="/plan-trip"
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)"
          }}
          whileTap={{ 
            scale: 0.97,
            boxShadow: "0 5px 10px -3px rgba(59, 130, 246, 0.5)" 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 15 
          }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg border border-blue-500/30 flex items-center gap-2 group"
        >
          <span className="relative z-10">Start Planning</span>
          
          {/* Animated arrow icon */}
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ x: 0 }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "loop", ease: "easeInOut" }}
            className="relative z-10"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </motion.svg>
          
          {/* Animated shine effect */}
          <motion.div
            className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ left: ["0%", "200%"] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              repeatDelay: 3,
              ease: "easeInOut" 
            }}
          />
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default About;
