import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="relative bg-black">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-black/50 pointer-events-none" />
      
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto py-16 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            {/* Company Info & Description - 6 columns */}
            <div className="md:col-span-6 space-y-8">
              <div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center mb-6"
                >
                  <img
                    src="/favicon.svg"
                    alt="SubtleAI Logo"
                    className="w-8 h-8 mr-2"
                  />
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SubtleAI
                  </span>
                </motion.div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  Transform your videos with AI-powered subtitles. Fast, accurate, and multilingual subtitle generation for content creators worldwide. Experience professional-grade results with our cutting-edge technology.
                </p>
              </div>
            </div>

            {/* Legal Links - 3 columns */}
            <div className="md:col-span-3 space-y-6">
              <p className="text-gray-300 font-medium">Legal</p>
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm w-fit group flex items-center"
                >
                  <span className="relative">
                    Privacy Policy
                    <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-blue-400/0 via-blue-400/70 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </Link>
                <Link 
                  to="/terms-of-service" 
                  className="text-gray-400 hover:text-purple-400 transition-colors text-sm w-fit group flex items-center"
                >
                  <span className="relative">
                    Terms of Service
                    <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-purple-400/0 via-purple-400/70 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Contact Information - 3 columns */}
            <div className="md:col-span-3 space-y-6">
              <p className="text-gray-300 font-medium">Contact Us</p>
              <div className="text-gray-400 space-y-2 text-sm backdrop-blur-xl bg-white/5 rounded-lg p-4 border border-white/10">
                <p>1606 Headway Cir</p>
                <p>STE 9810</p>
                <p>Austin, TX 78754</p>
                <p>United States</p>
              </div>
            </div>
          </div>
          
          {/* Copyright line */}
          <div className="mt-16 pt-8 pb-4 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Subtle AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}