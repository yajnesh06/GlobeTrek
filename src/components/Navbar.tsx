
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plane, User, LogOut, Save, Menu, X, Compass, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,  // Slightly longer for smoother animation
      ease: "easeOut"
    }
  }
};

const logoVariants = {
  hover: {
    scale: 1.05,
    rotate: [0, -5, 0, 5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  initial: {
    scale: 1,
    rotate: 0
  }
};

const staggerMenuItems = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const menuItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-2 border-b border-gray-100' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <motion.div
          whileHover="hover"
          initial="initial"
          variants={logoVariants}
        >
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            aria-label="GlobeTrekAI Home"
          >
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <Plane className="h-6 w-6 text-[#2563eb] group-hover:text-[#1e40af] transition-colors" strokeWidth={2.5} />
              <motion.div 
                className="absolute -inset-1 rounded-full bg-blue-100 opacity-0 group-hover:opacity-30 transition-opacity"
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <span className="font-bold text-2xl text-gray-900 group-hover:text-[#2563eb] transition-colors">GlobeTrekAI</span>
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <motion.div 
          className="hidden md:flex items-center space-x-5"
          variants={staggerMenuItems}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={menuItemVariants}>
            <Link to="/">
              <Button 
                variant="ghost" 
                className={`font-medium relative ${location.pathname === '/' ? 'text-[#2563eb] after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-[#2563eb] after:rounded-full' : ''}`}
              >
                Home
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={menuItemVariants}>
            <Link to="/about">
              <Button 
                variant="ghost" 
                className={`font-medium relative ${location.pathname === '/about' ? 'text-[#2563eb] after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-[#2563eb] after:rounded-full' : ''}`}
              >
                About
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            variants={menuItemVariants} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Link to="/plan-trip">
              <Button 
                variant="default" 
                className="bg-[#2563eb] hover:bg-[#1e40af] text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 relative overflow-hidden group"
              >
                <Compass className="h-4 w-4 group-hover:animate-spin transition-all duration-700" />
                <span>Plan Your Trip</span>
                <motion.span 
                  className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </Link>
          </motion.div>
          
          {/* User profile section with sign-in */}
          {user ? (
            <motion.div variants={menuItemVariants}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 w-10 h-10 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || 'User'} />
                        <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.full_name && <p className="font-medium">{user.full_name}</p>}
                      {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/saved-trips" className="cursor-pointer">
                      <Save className="mr-2 h-4 w-4" />
                      <span>Saved Trips</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ) : (
            <motion.div variants={menuItemVariants} whileHover={{ scale: 1.05 }}>
              <Button 
                onClick={() => signInWithGoogle()}
                variant="outline"
                className="border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-medium transition-all"
              >
                Sign In
              </Button>
            </motion.div>
          )}
        </motion.div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
                aria-label="Menu"
              >
                <motion.div
                  animate={mobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-[#2563eb]" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
                {!mobileMenuOpen && (
                  <motion.span 
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-[#2563eb] rounded-full"
                    animate={{ 
                      x: [-10, 10, -10],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l-[#2563eb]/20">
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center mb-8">
                  <Plane className="h-5 w-5 text-[#2563eb] mr-2" />
                  <span className="font-bold text-xl">GlobeTrekAI</span>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Link to="/">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${location.pathname === '/' ? 'text-[#2563eb]' : ''}`}
                    >
                      Home
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${location.pathname === '/about' ? 'text-[#2563eb]' : ''}`}
                    >
                      About
                    </Button>
                  </Link>
                  <Link to="/plan-trip">
                    <Button 
                      variant="default" 
                      className="w-full justify-start bg-[#2563eb] hover:bg-[#1e40af] flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Plan Your Trip
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-auto">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center p-2 border rounded-lg">
                        <Avatar className="h-9 w-9 mr-2">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Link to="/profile">
                        <Button variant="outline" className="w-full justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                      </Link>
                      <Link to="/saved-trips">
                        <Button variant="outline" className="w-full justify-start">
                          <Save className="h-4 w-4 mr-2" />
                          Saved Trips
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => signOut()}
                        variant="ghost" 
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => signInWithGoogle()}
                      className="w-full justify-start bg-[#2563eb] hover:bg-[#1e40af]"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
