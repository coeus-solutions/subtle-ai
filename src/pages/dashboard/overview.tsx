import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Download,
  RefreshCw,
  Globe,
  Plus,
  Trash2,
  Clock,
  Info,
  Video as VideoIcon,
  ArrowRight,
  Timer,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { videos, subtitles, users } from '@/lib/api-client';
import type { Video, Subtitle, UserDetails } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { convertSrtToVtt } from '@/lib/subtitle-utils';
import { useToast } from "@/hooks/use-toast";
import { useUserDetails } from '@/hooks/use-user-details';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' }
];

function VideoCard({ video, onDelete, vttUrls }: { 
  video: Video; 
  onDelete: (videoId: string) => void;
  vttUrls: Record<string, string>;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const formatDuration = (minutes: number): string => {
    const totalSeconds = Math.floor(minutes * 60);
    const minutes_ = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes_}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }

    return 'Just now';
  };

  const getStatusBadgeStyle = () => {
    switch (video.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = () => {
    switch (video.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      default:
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    }
  };

  const handleDownload = async (subtitle: Subtitle) => {
    try {
      setIsDownloading(true);
      const blob = await subtitles.download(subtitle.uuid);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = video.original_name 
        ? `${video.original_name.split('.')[0]}_${subtitle.language}.srt`
        : `subtitles_${video.uuid}_${subtitle.language}.srt`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateSubtitles = async () => {
    try {
      setIsGenerating(true);
      const response = await videos.generateSubtitles(video.uuid, video.subtitle_languages[0] || 'en');
      
      // Show success message or handle UI updates
      if (response.status === 'completed') {
        // You could add a toast notification here if you have one
        console.log(response.detail);
      }
    } catch (error: any) {
      console.error('Generation failed:', error);
      // You could show an error message to the user here
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this video and its subtitles?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(video.uuid);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      {/* Video Preview Section */}
      <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden relative">
        {video.video_url && (
          <>
            <video
              src={video.video_url}
              className="w-full h-full object-cover"
              controls
              crossOrigin="anonymous"
              onLoadedMetadata={(e) => {
                const videoElement = e.currentTarget;
                // Enable showing of subtitles
                for (let i = 0; i < videoElement.textTracks.length; i++) {
                  const track = videoElement.textTracks[i];
                  track.mode = 'showing';
                }
              }}
            >
              {video.status === 'completed' && video.has_subtitles && video.subtitles.map(subtitle => {
                const vttUrl = vttUrls[subtitle.language];
                console.log('Adding subtitle track:', {
                  language: subtitle.language,
                  vttUrl,
                  hasVtt: !!vttUrl
                });
                return vttUrl ? (
                  <track
                    key={subtitle.uuid}
                    kind="subtitles"
                    src={vttUrl}
                    srcLang={subtitle.language}
                    label={SUPPORTED_LANGUAGES.find(l => l.code === subtitle.language)?.name || subtitle.language}
                    default={subtitle.language === 'en'}
                  />
                ) : null;
              })}
              Your browser does not support the video tag.
            </video>
            {(video.status === 'processing' || video.status === 'uploading') && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    Generating Subtitles...
                  </p>
                </div>
              </div>
            )}
          </>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm ${getStatusBadgeStyle()}`}>
            {video.status === 'uploading' ? 'processing' : video.status}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <span className="bg-black/70 px-2 py-1 rounded text-white text-xs backdrop-blur-sm">
            {video.duration_minutes > 0 ? formatDuration(video.duration_minutes) : '--:--'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Header: Title and Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {video.original_name || 'Untitled Video'}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500 gap-2">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(video.created_at)}
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete video</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Actions Section */}
        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          {video.status === 'completed' && video.has_subtitles && (
            video.subtitles.map((subtitle) => (
              <TooltipProvider key={subtitle.uuid}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(subtitle)}
                      disabled={isDownloading}
                      className="flex-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-300 transition-colors"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 mr-2" />
                          {subtitle.language.toUpperCase()}
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download {SUPPORTED_LANGUAGES.find(l => l.code === subtitle.language)?.name} subtitles</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          )}

          {video.status === 'failed' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary" 
                    size="sm"
                    onClick={handleGenerateSubtitles}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-2" />
                        Retry Generation
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Retry subtitle generation</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {video.status === 'processing' && (
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border animate-pulse">
      <div className="aspect-video bg-gray-200 rounded-t-xl" />
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="border-t pt-3">
          <div className="h-8 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const { user } = useAuth();
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [vttUrlsMap, setVttUrlsMap] = useState<Record<string, Record<string, string>>>({});
  const { fetchUserDetails } = useUserDetails();
  const { toast } = useToast();

  // Function to convert subtitles for a video
  const convertSubtitlesForVideo = async (video: Video) => {
    if (video.status === 'completed' && video.has_subtitles && video.subtitles.length > 0) {
      const vttUrls: Record<string, string> = {};
      
      for (const subtitle of video.subtitles) {
        try {
          const vttUrl = await convertSrtToVtt(subtitle.subtitle_url);
          vttUrls[subtitle.language] = vttUrl;
        } catch (error) {
          console.error(`Error converting subtitle for video ${video.uuid}:`, error);
        }
      }

      setVttUrlsMap(prev => ({
        ...prev,
        [video.uuid]: vttUrls
      }));
    }
  };

  // Cleanup function for object URLs
  const cleanupVttUrls = () => {
    Object.values(vttUrlsMap).forEach(urlMap => {
      Object.values(urlMap).forEach(url => {
        URL.revokeObjectURL(url);
      });
    });
  };

  const fetchVideos = async () => {
    try {
      const response = await videos.list(true);
      setVideoList(response.videos);
      
      // Convert subtitles for all videos that have them
      for (const video of response.videos) {
        await convertSubtitlesForVideo(video);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await fetchVideos();
      await fetchUserDetails();
      setIsLoading(false);
    };
    loadInitialData();

    // Cleanup on unmount
    return () => {
      cleanupVttUrls();
    };
  }, []);

  // Function to handle video deletion
  const handleVideoDelete = async (videoId: string) => {
    try {
      // First delete from the API
      await videos.delete(videoId);
      
      // If successful, update the UI
      setVideoList(prevVideos => prevVideos.filter(v => v.uuid !== videoId));
      
      // Show success toast
      toast({
        variant: "success",
        title: "Video Deleted",
        description: "Video and its subtitles have been removed successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not delete the video. Please try again later.",
        duration: 3000,
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Upload video
      const uploadResponse = await videos.upload({
        file,
        language: selectedLanguage
      });

      // Add video to list
      const newVideo: Video = {
        uuid: uploadResponse.video_uuid,
        video_url: uploadResponse.file_url,
        original_name: file.name,
        duration_minutes: 0,
        status: 'uploading',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        has_subtitles: false,
        subtitle_languages: [],
        subtitles: []
      };

      setVideoList(prev => [newVideo, ...prev]);
      setIsUploadModalOpen(false);
      event.target.value = '';

      // Generate subtitles
      const generationResponse = await videos.generateSubtitles(
        uploadResponse.video_uuid,
        selectedLanguage
      );

      // Update video in list with subtitle info
      setVideoList(prev => prev.map(v => {
        if (v.uuid === uploadResponse.video_uuid) {
          return {
            ...v,
            status: generationResponse.status as Video['status'],
            duration_minutes: generationResponse.duration_minutes || 0,
            has_subtitles: true,
            subtitle_languages: [generationResponse.language],
            subtitles: [{
              uuid: generationResponse.subtitle_uuid,
              language: generationResponse.language,
              subtitle_url: generationResponse.subtitle_url,
              created_at: new Date().toISOString()
            }]
          };
        }
        return v;
      }));

      // Convert subtitles for the new video
      const updatedVideo: Video = {
        ...newVideo,
        status: generationResponse.status as Video['status'],
        duration_minutes: generationResponse.duration_minutes || 0,
        has_subtitles: true,
        subtitle_languages: [generationResponse.language],
        subtitles: [{
          uuid: generationResponse.subtitle_uuid,
          language: generationResponse.language,
          subtitle_url: generationResponse.subtitle_url,
          created_at: new Date().toISOString()
        }]
      };
      await convertSubtitlesForVideo(updatedVideo);

      // Refresh user details to update minutes
      await fetchUserDetails();

      toast({
        variant: "success",
        title: "Success",
        description: "Video uploaded and subtitles generated successfully.",
        duration: 3000,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process video');
      console.error('Error processing video:', err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err.response?.data?.detail || 'Failed to process video',
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pl-8 relative">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Videos
        </h1>
        <p className="mt-1 text-gray-600">
          Upload videos and generate accurate AI-powered subtitles in multiple languages
        </p>
      </div>

      {/* Floating Upload Button */}
      <Button
        onClick={() => setIsUploadModalOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
      >
        <Plus className="w-4 h-4 mr-2" />
        Upload Video
      </Button>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px] z-[100] bg-white">
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
            <DialogDescription>
              Select a video file and choose the language for subtitle generation
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            
            <div className="flex flex-col gap-4">
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
                disabled={isUploading}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={8} className="bg-white z-[110]">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
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
        </DialogContent>
      </Dialog>

      {error && (
        <div className="mb-8 p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Video Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoList.map((video) => (
          <VideoCard 
            key={video.uuid} 
            video={video} 
            onDelete={handleVideoDelete}
            vttUrls={vttUrlsMap[video.uuid] || {}}
          />
        ))}
      </div>

      {videoList.length === 0 && !isLoading && (
        <div className="text-center py-16 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-white">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <VideoIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No videos yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Upload your first video and let SubtleAI generate accurate subtitles for you in minutes.
          </p>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload your first video
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}