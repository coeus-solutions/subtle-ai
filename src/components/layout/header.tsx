import React from 'react';
import { Link } from 'react-router-dom';
import { Subtitles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Subtitles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            SubtleAI
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Try for Free</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}