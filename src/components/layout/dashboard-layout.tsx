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
import { motion } from 'framer-motion';

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
        <div className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-lg border-b border-white/10 z-10 flex items-center">
          <Link to="/dashboard" className="w-64 flex-shrink-0 px-6">
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

          <div className="flex-1 flex items-center justify-end px-6 space-x-6">
            {/* Usage Section */}
            {userDetails && (
              <div className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-lg border border-blue-500/20 hover:border-blue-500/30 transition-colors">
                {/* Minutes Usage */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/20">
                      <Timer className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-base font-semibold bg-gradient-to-r from-blue-100 to-purple-100 bg-clip-text text-transparent">
                      {userDetails.minutes_consumed.toFixed(1)} min used
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${getUsagePercentage()}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-blue-200/80">
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/30 transition-colors flex items-center justify-center">
                    <span className="text-base font-semibold bg-gradient-to-r from-blue-100 to-purple-100 bg-clip-text text-transparent">
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
        <div className="w-64 bg-black/80 backdrop-blur-lg shadow-lg fixed left-0 top-16 bottom-0 border-r border-white/10 flex flex-col">
          {/* Navigation Links */}
          <nav className="flex-1 mt-6 px-3 space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 text-white border border-blue-500/20' 
                    : 'text-gray-400 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/10 hover:to-blue-500/10 hover:text-white hover:border hover:border-blue-500/20'
                }`
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-500/20' : 'bg-white/5'} mr-3`}>
                    <Video className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  </div>
                  <span className="font-medium">Videos</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/dashboard/subtitles"
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 text-white border border-blue-500/20' 
                    : 'text-gray-400 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/10 hover:to-blue-500/10 hover:text-white hover:border hover:border-blue-500/20'
                }`
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-500/20' : 'bg-white/5'} mr-3`}>
                    <Subtitles className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  </div>
                  <span className="font-medium">Subtitles</span>
                </>
              )}
            </NavLink>

            <div className="pt-4 mt-4 border-t border-white/10">
              <NavLink
                to="/dashboard/billing"
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 text-white border border-blue-500/20' 
                      : 'text-gray-400 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/10 hover:to-blue-500/10 hover:text-white hover:border hover:border-blue-500/20'
                  }`
                }
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-500/20' : 'bg-white/5'} mr-3`}>
                      <CreditCard className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                    </div>
                    <span className="font-medium">Billing & Usage</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/dashboard/settings"
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 text-white border border-blue-500/20' 
                      : 'text-gray-400 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/10 hover:to-blue-500/10 hover:text-white hover:border hover:border-blue-500/20'
                  }`
                }
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-500/20' : 'bg-white/5'} mr-3`}>
                      <Settings className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                    </div>
                    <span className="font-medium">Settings</span>
                  </>
                )}
              </NavLink>
            </div>
          </nav>

          {/* Sign Out Button at Bottom */}
          <div className="p-4 border-t border-white/10">
            <Button 
              variant="outline" 
              className="w-full justify-start text-blue-300 hover:text-blue-200 bg-blue-500/5 border-blue-500/30 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all duration-200 group"
              onClick={handleLogout}
            >
              <div className="p-1.5 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors mr-2">
                <LogOut className="w-4 h-4 text-blue-300 group-hover:text-blue-200 transition-colors" />
              </div>
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