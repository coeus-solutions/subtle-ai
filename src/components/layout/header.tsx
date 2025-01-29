import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/">
          <Logo textClassName="text-gray-900" />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Studio</Link>
              <Button variant="outline" onClick={logout}>Sign out</Button>
            </>
          ) : (
            <>
              {!isAuthPage && (
                <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              )}
              <Link to="/login">
                <Button variant="outline">Sign in</Button>
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