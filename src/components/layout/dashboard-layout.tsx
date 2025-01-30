import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Info,
  Video,
  Subtitles,
  Settings,
  CreditCard,
  Timer,
  DollarSign,
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

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUsagePercentage = () => {
    if (!userDetails) return 0;
    return Math.min(100, (userDetails.minutes_consumed / userDetails.free_minutes_allocation) * 100);
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
      <div className="flex h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-10 flex items-center">
          <Link to="/dashboard" className="w-64 flex-shrink-0 px-6">
            <Logo />
          </Link>

          <div className="flex-1 flex items-center justify-end px-6 space-x-6">
            {/* Usage Section */}
            {userDetails && (
              <div className="flex items-center px-6 py-2.5 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                {/* Minutes Usage */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2.5">
                    <Timer className="w-5 h-5 text-gray-500" />
                    <span className="text-base font-semibold text-gray-900">
                      {userDetails.minutes_consumed.toFixed(1)} min used
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="w-40 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${getUsageColor()}`}
                        style={{ width: `${getUsagePercentage()}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {userDetails.free_minutes_allocation - userDetails.minutes_consumed > 0 
                        ? `${(userDetails.free_minutes_allocation - userDetails.minutes_consumed).toFixed(1)} min left`
                        : 'Quota exceeded'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* User Avatar */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-base font-semibold text-blue-600">
                      {user?.email ? getUserInitials(user.email) : 'U'}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{user?.email}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg fixed left-0 top-16 bottom-0 border-r border-gray-100 flex flex-col">
          {/* Navigation Links */}
          <nav className="flex-1 mt-6 px-3 space-y-1">
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

          {/* Sign Out Button at Bottom */}
          <div className="p-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Sign out</span>
            </Button>
          </div>
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