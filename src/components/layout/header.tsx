import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function Header() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/favicon.svg"
              alt="SubtleAI Logo"
              className="w-8 h-8 mr-2"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              SubtleAI
            </span>
          </motion.div>
        </Link>

        {!isAuthPage && (
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" className="border-white/20 hover:border-white/40 hover:bg-white/5 text-gray-100 hover:text-white transition-colors font-medium bg-white/5">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </div>
        )}
      </nav>
    </motion.header>
  );
}