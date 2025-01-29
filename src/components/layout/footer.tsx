import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Logo and Company Info */}
          <div>
            <Logo textClassName="text-white" />
            <p className="mt-4 text-sm text-gray-400 max-w-md">
              Transform your videos with AI-powered subtitles in minutes. Powered by advanced AI for maximum precision.
            </p>
            <div className="mt-8 flex items-center space-x-6">
              {['Privacy Policy', 'Terms of Service'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="flex justify-end">
            <div>
              <div className="flex items-center space-x-2 text-blue-400 mb-4">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Our Office</span>
              </div>
              <div>
                <p className="text-sm">1606 Headway Cir</p>
                <p className="text-sm">STE 9810</p>
                <p className="text-sm">Austin, TX 78754</p>
                <p className="text-sm">United States</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright - Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} SubtleAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}