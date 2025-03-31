import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaCloudSun, FaStar, FaFilter } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const About = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen bg-gradient-to-b from-white to-voyage-100 px-6 md:px-16 py-10 overflow-hidden font-sans"
    >
      {/* Optimized Background Animation */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-voyage-400 opacity-30 blur-[60px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
         <Navbar />
      {/* Title */}
      <motion.h1 variants={itemVariants} className="text-4xl p-4 m-6 md:text-6xl font-bold text-center text-gray-900 relative">
        About <span className="text-voyage-600">GlobeTrekAI</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p variants={itemVariants} className="text-center text-lg text-gray-600 mt-4 relative">
        Your AI-powered travel assistant, simplifying trip planning with smart recommendations.
      </motion.p>

      {/* Feature Cards */}
      <motion.div variants={containerVariants} className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {[
          { icon: <FaGlobeAmericas size={35} />, title: "Global Reach", desc: "Explore destinations worldwide with AI-powered insights." },
          { icon: <FaCloudSun size={35} />, title: "Real-Time Weather", desc: "Stay updated with accurate weather forecasts for your trips." },
          { icon: <FaStar size={35} />, title: "AI Chat", desc: "Get instant, AI-powered travel insights and recommendations tailored to your trip needs." },
          { icon: <FaFilter size={35} />, title: "Advanced Filtering", desc: "Customize your search with powerful filtering options." }
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
           
            className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center transition-transform hover:shadow-xl relative"
          >
            <motion.div className="text-voyage-600 mb-4">{item.icon}</motion.div>
            <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
            <p className="text-gray-600 mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div variants={itemVariants} className="mt-12 flex justify-center relative">
  <motion.a
    href="/plan-trip"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.92 }}
    className="text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all  bg-voyage-500"
  >
    Start Planning
  </motion.a>
</motion.div>

    </motion.div>
  );
};

export default About;
