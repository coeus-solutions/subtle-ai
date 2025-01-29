import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  BarChart, 
  User, 
  Info,
  Video,
  Subtitles,
  History,
  Settings,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useUserDetails } from '@/hooks/use-user-details';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { userDetails, fetchUserDetails } = useUserDetails();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
      <div className="flex h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-10 flex items-center">
          <Link to="/dashboard" className="w-64 flex-shrink-0 px-6">
            <Logo />
          </Link>

          <div className="flex-1 flex items-center justify-between px-6">
            {userDetails && (
              <div className="flex items-center space-x-2">
                <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (userDetails.minutes_consumed / userDetails.free_minutes_allocation) * 100)}%` 
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {userDetails.minutes_consumed.toFixed(1)} / {userDetails.free_minutes_allocation} min
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Usage Details</p>
                        <p className="text-xs text-gray-500">Cost per minute: ${userDetails.cost_per_minute.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Total cost: ${userDetails.total_cost.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Free minutes remaining: {Math.max(0, userDetails.free_minutes_allocation - userDetails.free_minutes_used).toFixed(1)}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-gray-200 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                Sign out
              </Button>
            </div>
          </div>
        </div>

        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 border-r border-gray-100">
          <nav className="mt-6 px-3 space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Video className="w-5 h-5 mr-3" />
              <span className="font-medium">Videos</span>
            </NavLink>

            <NavLink
              to="/dashboard/subtitles"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Subtitles className="w-5 h-5 mr-3" />
              <span className="font-medium">Subtitles</span>
            </NavLink>

            <div className="pt-4 mt-4 border-t border-gray-100">
              <NavLink
                to="/dashboard/billing"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <CreditCard className="w-5 h-5 mr-3" />
                <span className="font-medium">Billing & Usage</span>
              </NavLink>

              <NavLink
                to="/dashboard/settings"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Settings</span>
              </NavLink>
            </div>
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