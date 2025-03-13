import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { shared, type SharedVideoResponse } from '@/lib/api-client';
import { 
  Loader2, Clock, Lock, Video, Subtitles, CreditCard, 
  Settings, Timer, LogOut, UserCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const SIDEBAR_ITEMS = [
  { icon: Video, label: 'Videos', href: '/dashboard' },
  { icon: Subtitles, label: 'Subtitles', href: '/dashboard/subtitles' },
  { icon: CreditCard, label: 'Billing & Usage', href: '/dashboard/billing', divider: true },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function WatchPage() {
  const { shareUuid } = useParams();
  const [video, setVideo] = useState<SharedVideoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        if (!shareUuid) throw new Error('No share UUID provided');
        const data = await shared.watch(shareUuid);
        setVideo(data);
      } catch (err) {
        setError('Video not found or no longer available');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [shareUuid]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const videoSource = video?.burned_video_url || video?.processed_video_url || video?.video_url;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 p-4 rounded-full bg-red-100 inline-block">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Video not found'}
          </h1>
          <p className="text-gray-600 mb-4">
            This video may have been removed or is no longer accessible
          </p>
          <Link to="/register">
            <Button>
              Sign up for full access
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Top Bar - Blurred */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-lg border-b border-white/10 z-10 flex items-center pointer-events-none">
        <Link to="/dashboard" className="w-64 flex-shrink-0 px-6">
          <div className="flex items-center">
            <img
              src="/favicon.svg"
              alt="SubtleAI Logo"
              className="w-8 h-8 mr-2"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              SubtleAI
            </span>
          </div>
        </Link>

        <div className="flex-1 flex items-center justify-end px-6 space-x-6">
          {/* Usage Section - Semi-visible */}
          <div className="flex items-center px-6 py-3 bg-black/60 backdrop-blur-lg rounded-lg border border-white/20">
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/10">
                  <Timer className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-base font-medium text-gray-300">
                  Usage Info
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 rounded-full bg-white/20" />
                </div>
                <span className="text-sm text-gray-400">Sign up to track usage</span>
              </div>
            </div>
          </div>

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-lg border border-white/20 flex items-center justify-center">
            <UserCircle2 className="w-6 h-6 text-gray-300" />
          </div>
        </div>
      </div>

      {/* Left Sidebar - Blurred */}
      <div className="w-64 bg-black/80 backdrop-blur-lg shadow-lg fixed left-0 top-16 bottom-0 border-r border-white/10 flex flex-col">
        {/* Lock Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <div className="text-center px-6">
            <div className="mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mx-auto">
                <Lock className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Get Full Access
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Sign up to unlock AI voice-over, dubbing, custom subtitle styles, and advanced features for your videos
            </p>
            <div className="space-y-3">
              <Link to="/register">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  Sign up free
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links (Blurred) */}
        <nav className="flex-1 mt-6 px-3 space-y-1 pointer-events-none">
          {SIDEBAR_ITEMS.map((item) => (
            <React.Fragment key={item.label}>
              <div className="flex items-center px-4 py-3 rounded-lg text-gray-400">
                <div className="p-1.5 rounded-lg bg-white/5 mr-3">
                  <item.icon className="w-4 h-4 text-gray-400" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.divider && (
                <div className="my-4 border-t border-white/10" />
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Sign Out Button (Blurred) */}
        <div className="p-4 border-t border-white/10">
          <div className="w-full flex items-center px-4 py-2 rounded-lg text-gray-400 bg-white/5 border border-white/10">
            <div className="p-1.5 rounded-lg bg-white/5 mr-2">
              <LogOut className="w-4 h-4 text-gray-400" />
            </div>
            <span className="font-medium">Sign out</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 mt-16 bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
          {/* Video Player Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            {/* Video Title Bar */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">
                  {video.original_name || 'Shared Video'}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(video.duration_minutes)}</span>
                </div>
              </div>
              <div className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium",
                video.processing_type === 'voiceover'
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : video.processing_type === 'dubbing'
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
              )}>
                {video.processing_type === 'voiceover' 
                  ? 'AI Voice Over'
                  : video.processing_type === 'dubbing'
                  ? 'AI Dubbed'
                  : 'AI Subtitled'}
              </div>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black relative">
              <video
                key={videoSource}
                src={videoSource}
                className="w-full h-full"
                controls
                autoPlay
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 