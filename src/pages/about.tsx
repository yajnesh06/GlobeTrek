import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaCloudSun, FaStar, FaFilter } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const About = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen bg-gradient-to-b from-white to-blue-100 px-6 md:px-16 py-10 overflow-hidden font-sans"
    >
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-300 to-blue-500 opacity-40 blur-[80px] animate-pulse"
        animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      
      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-6xl font-bold text-center text-gray-900 relative"
      >
        About <span className="text-blue-600">Voyageur AI</span>
      </motion.h1>
      
      <motion.p variants={itemVariants} className="text-center text-lg text-gray-600 mt-4 relative">
        Your AI-powered travel assistant, simplifying trip planning with smart recommendations.
      </motion.p>
      
      <motion.div
        variants={containerVariants}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
      >
        {[ 
          { icon: <FaGlobeAmericas size={40} />, title: "Global Reach", desc: "Explore destinations worldwide with AI-powered insights." },
          { icon: <FaCloudSun size={40} />, title: "Real-Time Weather", desc: "Stay updated with accurate weather forecasts for your trips." },
          { icon: <FaStar size={40} />, title: "AI Chat", desc: "Get instant, AI-powered travel insights and recommendations tailored to your trip needs." },
          { icon: <FaFilter size={40} />, title: "Advanced Filtering", desc: "Customize your search with powerful filtering options." }
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:shadow-2xl relative overflow-hidden"
          >
            <motion.div
              className="text-blue-600 mb-4 transition-all duration-300"
            >
              {item.icon}
            </motion.div>
            <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
            <p className="text-gray-600 mt-2">{item.desc}</p>
            <motion.div
              className="absolute w-full h-full bg-gradient-to-r from-blue-300 to-blue-500 opacity-20 blur-2xl top-0 left-0 scale-0"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        className="mt-16 flex justify-center relative"
      >
        <motion.a
          href="/plan"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-2xl"
        >
          Start Planning
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default About;
