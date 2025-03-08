
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
      duration: 0.3,
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <motion.div
          whileHover="hover"
          variants={logoVariants}
        >
          <Link 
            to="/" 
            className="flex items-center space-x-2"
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
            >
              <Plane className="h-6 w-6 text-voyage-500" strokeWidth={2.5} />
            </motion.div>
            <span className="font-bold text-2xl text-gray-900">GlobeTrekAI</span>
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <motion.div 
          className="hidden md:flex items-center space-x-4"
          variants={staggerMenuItems}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={menuItemVariants}>
            <Link to="/">
              <Button 
                variant={location.pathname === '/' ? 'secondary' : 'ghost'} 
                className="font-medium"
              >
                Home
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={menuItemVariants}>
            <Link to="/about">
              <Button 
                variant={location.pathname === '/about' ? 'secondary' : 'ghost'} 
                className="font-medium"
              >
                About
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={menuItemVariants} whileHover={{ scale: 1.05 }}>
            <Link to="/plan-trip">
              <Button 
                variant="default" 
                className="bg-voyage-500 hover:bg-voyage-600 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Compass className="h-4 w-4" />
                Plan Your Trip
              </Button>
            </Link>
          </motion.div>
          
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
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ) : (
            <motion.div 
              variants={menuItemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => signInWithGoogle()}
                variant="outline"
                className="border-voyage-400 text-voyage-600 hover:bg-voyage-50"
              >
                Sign In
              </Button>
            </motion.div>
          )}
        </motion.div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <motion.div 
                className="flex flex-col space-y-4 mt-8"
                variants={staggerMenuItems}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={menuItemVariants}>
                  <Link to="/">
                    <Button 
                      variant={location.pathname === '/' ? 'secondary' : 'ghost'} 
                      className="w-full justify-start"
                    >
                      Home
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div variants={menuItemVariants}>
                  <Link to="/about">
                    <Button 
                      variant={location.pathname === '/about' ? 'secondary' : 'ghost'} 
                      className="w-full justify-start"
                    >
                      About
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div variants={menuItemVariants}>
                  <Link to="/plan-trip">
                    <Button 
                      variant="default" 
                      className="w-full justify-start bg-voyage-500 hover:bg-voyage-600 flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Plan Your Trip
                    </Button>
                  </Link>
                </motion.div>
                
                {user ? (
                  <>
                    <motion.div variants={menuItemVariants} className="flex items-center space-x-2 px-4 py-2">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || 'User'} />
                        <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        {user.full_name && <p className="font-medium">{user.full_name}</p>}
                        {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                      </div>
                    </motion.div>
                    
                    <motion.div variants={menuItemVariants}>
                      <Link to="/profile">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                    </motion.div>
                    
                    <motion.div variants={menuItemVariants}>
                      <Link to="/saved-trips">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Saved Trips
                        </Button>
                      </Link>
                    </motion.div>
                    
                    <motion.div 
                      variants={menuItemVariants}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start"
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div 
                    variants={menuItemVariants}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={() => signInWithGoogle()}
                      className="w-full justify-start bg-voyage-500 hover:bg-voyage-600"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
