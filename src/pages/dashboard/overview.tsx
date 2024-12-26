import React, { useState, useEffect, useRef } from 'react';
import { Video, Subtitles, Upload, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { videos, subtitles } from '@/lib/api-client';
import type { Video as VideoType, Subtitle } from '@/lib/api-client';

export function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalSubtitles: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [videosResponse, subtitlesResponse] = await Promise.all([
        videos.list(),
        subtitles.list(),
      ]);
      setStats({
        totalVideos: videosResponse.count,
        totalSubtitles: subtitlesResponse.count,
      });
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress('Uploading video...');
      
      // Step 1: Upload the video
      const uploadResponse = await videos.upload(file);
      setUploadProgress('Generating subtitles...');
      
      // Step 2: Generate subtitles using the video UUID
      await videos.generateSubtitles(uploadResponse.video_uuid);
      
      // Step 3: Refresh stats in the background
      fetchStats();

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Navigate to videos page
      navigate('/dashboard/videos', { 
        state: { 
          message: 'Video uploaded successfully! Subtitle generation is in progress...',
          videoId: uploadResponse.video_uuid
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process video');
      console.error('Error processing video:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.email}
        </h1>
        <p className="mt-1 text-gray-600">
          Upload your videos and get AI-generated subtitles in minutes
        </p>
      </div>

      {/* Upload Area */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload a Video
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: MP4, AVI, MOV
            </p>
          </div>
          <Button
            onClick={handleUploadClick}
            disabled={isUploading}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>{uploadProgress}</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Select Video
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/dashboard/videos')}>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Videos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalVideos}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/dashboard/subtitles')}>
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <Subtitles className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Generated Subtitles
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalSubtitles}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}