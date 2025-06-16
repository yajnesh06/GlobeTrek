import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, Transition } from 'framer-motion';

import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Plane, Map, Clock, Globe, Users, Award, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

// Utility function for cn
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// GlowEffect Component
type GlowEffectProps = {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  mode?:
    | 'rotate'
    | 'pulse'
    | 'breathe'
    | 'colorShift'
    | 'flowHorizontal'
    | 'static';
  blur?:
    | number
    | 'softest'
    | 'soft'
    | 'medium'
    | 'strong'
    | 'stronger'
    | 'strongest'
    | 'none';
  transition?: Partial<Transition>;
  scale?: number;
  duration?: number;
};

function GlowEffect({
  className,
  style,
  colors = ['#2563eb', '#1e40af', '#3b82f6', '#60a5fa'],
  mode = 'rotate',
  blur = 'medium',
  transition,
  scale = 1,
  duration = 5,
}: GlowEffectProps) {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: duration,
    ease: 'linear',
  };

  const animations = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(', ')})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(', ')})`,
      ],
      transition: {
        ...(transition ?? BASE_TRANSITION),
      },
    },
    pulse: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
      ),
      scale: [1 * scale, 1.1 * scale, 1 * scale],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    breathe: {
      background: [
        ...colors.map(
          (color) =>
            `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
        ),
      ],
      scale: [1 * scale, 1.05 * scale, 1 * scale],
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    colorShift: {
      background: colors.map((color, index) => {
        const nextColor = colors[(index + 1) % colors.length];
        return `conic-gradient(from 0deg at 50% 50%, ${color} 0%, ${nextColor} 50%, ${color} 100%)`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    flowHorizontal: {
      background: colors.map((color) => {
        const nextColor = colors[(colors.indexOf(color) + 1) % colors.length];
        return `linear-gradient(to right, ${color}, ${nextColor})`;
      }),
      transition: {
        ...(transition ?? {
          ...BASE_TRANSITION,
          repeatType: 'mirror',
        }),
      },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    },
  };

  const getBlurClass = (blur: GlowEffectProps['blur']) => {
    if (typeof blur === 'number') {
      return `blur-[${blur}px]`;
    }

    const presets = {
      softest: 'blur-sm',
      soft: 'blur',
      medium: 'blur-md',
      strong: 'blur-lg',
      stronger: 'blur-xl',
      strongest: 'blur-xl',
      none: 'blur-none',
    };

    return presets[blur as keyof typeof presets];
  };

  return (
    <motion.div
      style={
        {
          ...style,
          '--scale': scale,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        } as React.CSSProperties
      }
      animate={animations[mode]}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        'scale-[var(--scale)] transform-gpu',
        getBlurClass(blur),
        className
      )}
    />
  );
}

// Particles Component
interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [color]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      drawCircle(circle, true);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

// Enhanced CTA Section Component
function EnhancedCTASection() {
  return (
    <section className="relative py-32 px-4 overflow-hidden min-h-[80vh] flex items-center justify-center">
      {/* Enhanced animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb] via-[#1e40af] to-[#1d4ed8] opacity-95" />
        <GlowEffect
          colors={['#3b82f6', '#60a5fa', '#2563eb', '#1e40af']}
          mode="flowHorizontal"
          blur="strong"
          duration={8}
          className="opacity-30"
        />
      </div>
      
      {/* Interactive particles */}
      <Particles
        className="absolute inset-0"
        quantity={150}
        staticity={30}
        ease={80}
        color="#ffffff"
        size={1.2}
      />
      
      {/* Enhanced floating blobs with better animations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] rounded-full mix-blend-multiply filter blur-3xl opacity-60 -mb-60 -mr-60"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#1d4ed8] to-[#2563eb] rounded-full mix-blend-multiply filter blur-3xl opacity-50 -mt-60 -ml-60"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full mix-blend-multiply filter blur-3xl opacity-40"
      />
      
      {/* Enhanced content container */}
      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Enhanced title with better typography */}
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Ready to Plan Your Dream Trip?
            </span>
          </motion.h2>
          
          {/* Enhanced description */}
          <motion.p 
            className="text-xl md:text-2xl text-blue-50/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Let our AI create a customized itinerary tailored to your interests and preferences. It only takes a few minutes!
          </motion.p>
          
          {/* Enhanced button with glow effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative inline-block"
          >
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-2xl scale-110 opacity-50" />
            <Link to="/plan-trip">
              <Button 
                size="lg" 
                className="relative bg-white text-[#2563eb] hover:bg-blue-50 font-semibold px-12 py-6 text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 rounded-2xl border-2 border-white/20"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Create My Travel Plan
                </motion.span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
    </section>
  );
}

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Force video to play again on component mount
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.error("Video playback failed:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero scrollToRef={featuresRef} />
      
      {/* Features section with video */}
      <section ref={featuresRef} className="py-8 md:py-12 px-0 relative bg-gray-50">
        <div className="container mx-auto max-w-full px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            
            {/* Left Side: Flowchart Content (1/3 width on desktop, full width on mobile) */}
            <div className="md:w-1/3 w-full flex flex-col items-center text-center">
              {/* Header */}
              <div className="mb-8 md:mb-12">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  How GlobeTrekAI Works
                </h2>
                <p className="text-base md:text-lg text-gray-500 mt-2 md:mt-3 font-medium">
                  Our AI assistant simplifies
                  trip planning. <br />  Share your preferences,
                  and get a  <br /> personalized itinerary in minutes.
                </p>
              </div>

              {/* Flowchart Boxes */}
              <div className="flex flex-col items-center gap-6 md:gap-8 relative">
                {/* Flowchart Box 1 */}
                <div className="relative bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[280px] md:max-w-xs">
                  <div className="flex items-center mb-2 md:mb-3">
                    <div className="bg-[#2563eb]/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3 border border-[#2563eb]/20">
                      <Map className="h-4 w-4 md:h-5 md:w-5 text-[#2563eb]" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">Share Your Preferences</h3>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    Tell us where you want to go, your travel dates, budget, and what you enjoy doing.
                  </p>
                  {/* Arrow pointing to the next box */}
                  <div className="absolute bottom-[-24px] left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#2563eb] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </div>
                </div>

                {/* Flowchart Box 2 */}
                <div className="relative bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[280px] md:max-w-xs">
                  <div className="flex items-center mb-2 md:mb-3">
                    <div className="bg-[#2563eb]/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3 border border-[#2563eb]/20">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 text-[#2563eb]" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">AI Creates Your Plan</h3>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    Our AI analyzes your preferences and crafts a personalized itinerary in minutes.
                  </p>
                  {/* Arrow pointing to the next box */}
                  <div className="absolute bottom-[-24px] left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#2563eb] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </div>
                </div>

                {/* Flowchart Box 3 */}
                <div className="relative bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[280px] md:max-w-xs">
                  <div className="flex items-center mb-2 md:mb-3">
                    <div className="bg-[#2563eb]/10 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mr-2 md:mr-3 border border-[#2563eb]/20">
                      <Plane className="h-4 w-4 md:h-5 md:w-5 text-[#2563eb]" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">Enjoy Your Trip</h3>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    Get a day-by-day itinerary with attractions, restaurants, and local gems to explore.
                  </p>
                </div>
              </div>

              {/* Button - Centered Below Flowchart */}
              <div className="mt-8 md:mt-12">
                <Link to="/plan-trip">
                  <Button 
                    size="lg" 
                    className="bg-[#2563eb] hover:bg-[#1e40af] text-white font-medium px-8 md:px-10 py-5 md:py-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg md:text-xl"
                  >
                    Start Planning Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: Video (2/3 width on desktop, full width on mobile) */}
            <div className="md:w-2/3 w-full">
              <video 
                ref={videoRef}
                className="w-full h-full min-h-[300px] md:min-h-[450px] object-cover rounded-2xl shadow-xl"
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src="/vid1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced CTA Section replacing the old one */}
      <EnhancedCTASection />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center">
                <Plane className="h-6 w-6 text-[#60a5fa] mr-2" />
                <span className="text-2xl font-bold">GlobeTrekAI</span>
              </Link>
              <p className="mt-2 text-gray-400 max-w-md">
                AI-powered travel planning that creates personalized itineraries based on your preferences.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-medium mb-3 text-gray-300">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/plan-trip" className="text-gray-400 hover:text-white transition-colors">Plan Trip</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-gray-300">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} GlobeTrekAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
