import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Video, Subtitles, User, LogOut, BarChart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-10 flex items-center justify-between px-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
            <Video className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">
            VideoAnalyzer
          </span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-gray-200 hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4 mr-2 text-gray-500" />
            Logout
          </Button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 border-r border-gray-100">
        <nav className="mt-6 px-3">
          {[
            { icon: BarChart, label: 'Dashboard', path: '/dashboard' },
            { icon: Video, label: 'Videos', path: '/dashboard/videos' },
            { icon: Subtitles, label: 'Subtitles', path: '/dashboard/subtitles' },
            { icon: User, label: 'Profile', path: '/dashboard/profile' }
          ].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className={`w-5 h-5 mr-3`} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto ml-64 mt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}