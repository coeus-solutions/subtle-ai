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
  DollarSign,
  X,
  Subtitles
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
import toast from 'react-hot-toast';
import { useUserDetails } from '@/hooks/use-user-details';
import { cn } from '@/lib/utils';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ru', name: 'Russian'}
];

function VideoCard({ video, onDelete, vttUrls }: { 
  video: Video; 
  onDelete: (videoId: string) => void;
  vttUrls: Record<string, string>;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDubbedDownloading, setIsDubbedDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDubbedDownload = async () => {
    if (!video.dubbed_video_url) return;
    
    try {
      setIsDubbedDownloading(true);
      const response = await fetch(video.dubbed_video_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = video.original_name 
        ? `${video.original_name.split('.')[0]}_dubbed_${video.subtitle_languages[0]}.mp4`
        : `dubbed_video_${video.uuid}_${video.subtitle_languages[0]}.mp4`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Dubbed video download failed:', error);
      toast.error('Failed to download dubbed video. Please try again.');
    } finally {
      setIsDubbedDownloading(false);
    }
  };

  const handleGenerateSubtitles = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await videos.generateSubtitles(
        video.uuid, 
        video.subtitle_languages[0] || 'en'
      );
      
      if (response.status === 'completed') {
        toast.success('Subtitles generated successfully!');
        // Update video in the list
        setVideoList(prev => prev.map(v => 
          v.uuid === video.uuid 
            ? { ...v, status: 'completed', has_subtitles: true } 
            : v
        ));
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      
      // Handle different error cases
      let errorMessage = 'Failed to generate subtitles';
      const statusCode = err.response?.status;
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        
        if (detail.includes('OpenAI API error')) {
          try {
            const openAIError = JSON.parse(
              detail.substring(detail.indexOf('{'))
            );
            errorMessage = openAIError.error.message || 'Failed to process audio';
          } catch {
            errorMessage = 'Failed to process audio file';
          }
        } else {
          switch (statusCode) {
            case 400:
              errorMessage = `Invalid request: ${detail}`;
              break;
            case 422:
              errorMessage = `Validation error: ${detail}`;
              break;
            case 500:
              errorMessage = 'Server error while generating subtitles. Please try again.';
              break;
            default:
              errorMessage = detail;
          }
        }
      }

      // Update video status to failed
      setVideoList(prev => prev.map(v => 
        v.uuid === video.uuid 
          ? { ...v, status: 'failed' } 
          : v
      ));

      toast.error(errorMessage);
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
      // Show error toast
      toast.error("Failed to delete video. Please try again.");
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
                if (video.status === 'completed' && video.has_subtitles) {
                  const tracks = Array.from(videoElement.textTracks);
                  tracks.forEach(track => {
                    track.mode = track.language === video.subtitle_languages[0] ? 'showing' : 'hidden';
                  });
                }
              }}
            >
              {video.status === 'completed' && video.has_subtitles && video.subtitles.map(subtitle => {
                const vttUrl = vttUrls[subtitle.language];
                return vttUrl ? (
                  <track
                    key={subtitle.uuid}
                    kind="subtitles"
                    src={vttUrl}
                    srcLang={subtitle.language}
                    label={SUPPORTED_LANGUAGES.find(l => l.code === subtitle.language)?.name || subtitle.language}
                    default={subtitle.language === video.subtitle_languages[0]}
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
            <div className="w-full grid grid-cols-1 gap-2">
              {video.subtitles.map((subtitle) => (
                <TooltipProvider key={subtitle.uuid}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(subtitle)}
                        disabled={isDownloading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>{SUPPORTED_LANGUAGES.find(l => l.code === subtitle.language)?.name} Subtitles</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-900 text-gray-100 border border-gray-700">
                      <p>Download {SUPPORTED_LANGUAGES.find(l => l.code === subtitle.language)?.name} subtitles</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              
              {video.dubbed_video_url && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDubbedDownload}
                        disabled={isDubbedDownloading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {isDubbedDownloading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Downloading Dubbed Video...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Dubbed Video ({SUPPORTED_LANGUAGES.find(l => l.code === video.subtitle_languages[0])?.name})</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-900 text-gray-100 border border-gray-700">
                      <p>Download dubbed video in {SUPPORTED_LANGUAGES.find(l => l.code === video.subtitle_languages[0])?.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}

          {video.status === 'failed' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateSubtitles}
                    disabled={isGenerating}
                    className="w-full bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Retrying...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Retry Generation</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 text-gray-100 border border-gray-700">
                  <p>Retry subtitle generation</p>
                </TooltipContent>
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [enableDubbing, setEnableDubbing] = useState(false);
  const [showLanguageTooltip, setShowLanguageTooltip] = useState(false);

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

      // Enable subtitles for this video immediately
      enableSubtitlesForVideo(video.video_url, video.subtitle_languages[0]);
    }
  };

  // Add a new function to enable subtitles
  const enableSubtitlesForVideo = (videoUrl: string, defaultLanguage: string) => {
    // Find all video elements with this video's source
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(videoElement => {
      if (videoElement.src === videoUrl) {
        // Wait for tracks to be loaded
        if (videoElement.textTracks.length > 0) {
          // Enable the appropriate track
          Array.from(videoElement.textTracks).forEach(track => {
            track.mode = track.language === defaultLanguage ? 'showing' : 'hidden';
          });
        } else {
          // If tracks aren't loaded yet, wait for them
          videoElement.addEventListener('loadedmetadata', () => {
            Array.from(videoElement.textTracks).forEach(track => {
              track.mode = track.language === defaultLanguage ? 'showing' : 'hidden';
            });
          }, { once: true });
        }
      }
    });
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
      
      // Show success toast with a promise
      toast.promise(
        Promise.resolve(),
        {
          loading: 'Deleting video...',
          success: 'Video deleted successfully!',
          error: 'Could not delete the video'
        }
      );
    } catch (error) {
      console.error('Delete failed:', error);
      // Show error toast
      toast.error("Failed to delete video. Please try again.");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file format
    const supportedFormats = ['video/mp4', 'video/webm', 'audio/wav'];
    if (!supportedFormats.includes(file.type)) {
      setError('Please upload a video file in MP4, WebM, or WAV format.');
      toast.error("Unsupported file format. Please use MP4, WebM, or WAV.", {
        duration: 4000,
      });
      event.target.value = '';
      return;
    }

    // Check file size (20MB = 20 * 1024 * 1024 bytes)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      const fileSize = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File size must be less than 20 MB. Your file is ${fileSize} MB.`);
      toast.error(`File too large (${fileSize} MB). Maximum size is 20 MB.`, {
        duration: 4000,
      });
      event.target.value = '';
      return;
    }

    // If all validations pass
    setSelectedFile(file);
    setError(null);
    
    // Show success toast
    toast.success("File selected! Choose the target language.", {
      icon: '🎥',
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedLanguage) return;

    const uploadPromise = (async () => {
      try {
        setIsUploading(true);
        setError(null);

        // Upload video
        let uploadResponse;
        try {
          uploadResponse = await videos.upload({
            file: selectedFile,
            language: selectedLanguage
          });
        } catch (err: any) {
          // Handle upload API errors
          const errorMessage = err.response?.data?.detail || 'Failed to upload video';
          const statusCode = err.response?.status;

          switch (statusCode) {
            case 400:
              throw new Error(`Invalid request: ${errorMessage}`);
            case 413:
              throw new Error('File size too large. Maximum size is 20MB.');
            case 415:
              throw new Error('Unsupported file format. Please use MP4, WebM, or WAV.');
            case 422:
              throw new Error(`Validation error: ${errorMessage}`);
            case 500:
              throw new Error('Server error. Please try again later.');
            default:
              throw new Error(errorMessage);
          }
        }

        // Add video to list
        const newVideo: Video = {
          uuid: uploadResponse.video_uuid,
          video_url: uploadResponse.file_url,
          original_name: selectedFile.name,
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
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        try {
          // Generate subtitles
          const generationResponse = await videos.generateSubtitles(
            uploadResponse.video_uuid,
            selectedLanguage,
            { enable_dubbing: enableDubbing }
          );

          if (enableDubbing && generationResponse.dubbing_id) {
            // Start polling for dubbing status
            const pollDubbingStatus = async () => {
              try {
                const statusResponse = await videos.checkDubbingStatus(
                  uploadResponse.video_uuid,
                  generationResponse.dubbing_id
                );

                if (statusResponse.status === 'dubbed') {
                  // Get the dubbed video URL
                  const dubbedResponse = await videos.getDubbedVideo(
                    uploadResponse.video_uuid,
                    generationResponse.dubbing_id
                  );

                  // Get the transcript for dubbed video
                  const transcriptResponse = await videos.getTranscriptForDub(
                    uploadResponse.video_uuid,
                    generationResponse.dubbing_id
                  );

                  // Update video in list with dubbed info
                  const updatedVideo = {
                    ...newVideo,
                    status: 'completed',
                    duration_minutes: dubbedResponse.duration_minutes || 0,
                    has_subtitles: true,
                    subtitle_languages: [transcriptResponse.language],
                    subtitles: [{
                      uuid: transcriptResponse.subtitle_uuid,
                      language: transcriptResponse.language,
                      subtitle_url: transcriptResponse.subtitle_url,
                      created_at: new Date().toISOString(),
                      video_uuid: uploadResponse.video_uuid,
                      video_original_name: selectedFile.name,
                      format: 'srt',
                      updated_at: new Date().toISOString()
                    }],
                    dubbed_video_url: dubbedResponse.dubbed_video_url,
                    dubbing_id: dubbedResponse.dubbing_id,
                    is_dubbed_audio: true
                  };

                  setVideoList(prev => prev.map(v => 
                    v.uuid === uploadResponse.video_uuid ? updatedVideo : v
                  ));

                  // Convert and enable subtitles
                  await convertSubtitlesForVideo(updatedVideo);
                  return;
                }

                if (statusResponse.status === 'failed') {
                  throw new Error('Dubbing failed. Please try again.');
                }

                // Continue polling if still processing
                setTimeout(pollDubbingStatus, 5000);
              } catch (error) {
                console.error('Error polling dubbing status:', error);
                throw error;
              }
            };

            // Start polling
            pollDubbingStatus();
          } else {
            // Update video in list with subtitle info (non-dubbing case)
            const updatedVideo = {
              ...newVideo,
              status: generationResponse.status as Video['status'],
              duration_minutes: generationResponse.duration_minutes || 0,
              has_subtitles: true,
              subtitle_languages: [generationResponse.language],
              subtitles: [{
                uuid: generationResponse.subtitle_uuid,
                language: generationResponse.language as "en" | "es" | "fr" | "de" | "ja" | "ru",
                subtitle_url: generationResponse.subtitle_url,
                created_at: new Date().toISOString(),
                video_uuid: uploadResponse.video_uuid,
                video_original_name: selectedFile.name,
                format: 'srt',
                updated_at: new Date().toISOString()
              }]
            };

            setVideoList(prev => prev.map(v => 
              v.uuid === uploadResponse.video_uuid ? updatedVideo : v
            ));

            // Convert and enable subtitles
            await convertSubtitlesForVideo(updatedVideo);
          }

          // Refresh user details to update minutes
          await fetchUserDetails();

          return enableDubbing 
            ? "Video uploaded. Dubbing and subtitle generation in progress..."
            : "Video uploaded and subtitles generated successfully!";
        } catch (err: any) {
          // Update video status to failed
          setVideoList(prev => prev.map(v => {
            if (v.uuid === uploadResponse.video_uuid) {
              return {
                ...v,
                status: 'failed'
              };
            }
            return v;
          }));

          // Extract and format the error message
          let errorMessage = 'Failed to generate subtitles';
          
          // Handle subtitle generation API errors
          const statusCode = err.response?.status;
          if (err.response?.data?.detail) {
            const detail = err.response.data.detail;
            
            // Handle OpenAI specific errors
            if (detail.includes('OpenAI API error')) {
              try {
                const openAIError = JSON.parse(
                  detail.substring(detail.indexOf('{'))
                );
                errorMessage = openAIError.error.message || 'Failed to process audio';
              } catch {
                errorMessage = 'Failed to process audio file';
              }
            } else {
              // Handle other API errors
              switch (statusCode) {
                case 400:
                  errorMessage = `Invalid request: ${detail}`;
                  break;
                case 422:
                  errorMessage = `Validation error: ${detail}`;
                  break;
                case 500:
                  errorMessage = 'Server error while generating subtitles. Please try again.';
                  break;
                default:
                  errorMessage = detail;
              }
            }
          }
          throw new Error(errorMessage);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to process video');
        console.error('Error processing video:', err);
        throw new Error(err.message || 'Failed to process video');
      } finally {
        setIsUploading(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    })();

    // Show toast with promise
    toast.promise(
      uploadPromise,
      {
        loading: 'Uploading video...',
        success: (message) => message,
        error: (err) => err.message
      },
      {
        duration: 5000,
      }
    );
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Add a function to check if any video is currently processing
  const isAnyVideoProcessing = () => {
    return videoList.some(video => video.status === 'uploading' || video.status === 'processing');
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
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isAnyVideoProcessing()}
      >
        {isAnyVideoProcessing() ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Upload Video
          </>
        )}
      </Button>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen && !isAnyVideoProcessing()} onOpenChange={(open) => {
        // Only allow opening if no video is processing
        if (isAnyVideoProcessing()) {
          return;
        }
        setIsUploadModalOpen(open);
        if (!open) {
          setSelectedFile(null);
          setSelectedLanguage('en');
          setError(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      }}>
        <DialogContent className="sm:max-w-[425px] z-[100] bg-white">
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
            <DialogDescription className="space-y-2 mt-6">
              <p>Select a video file to generate subtitles and optional AI dubbing</p>
              <div className="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                <div className="font-medium mb-1">File requirements:</div>
                <ul className="list-disc list-inside space-y-1 text-blue-600">
                  <li>Maximum file size: 20 MB</li>
                  <li>Supported formats: MP4, WAV, WebM</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/mp4,video/webm,audio/wav"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            
            <div className="flex flex-col gap-6">
              {selectedFile && (
                <div className="flex flex-col">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <VideoIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-base font-semibold text-gray-900 truncate">
                            {selectedFile.name}
                          </p>
                          {!isUploading && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedFile(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-blue-600 font-medium">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-sm text-gray-500">
                            Ready to upload
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Target Language for Subtitles
                  </label>
                  <TooltipProvider>
                    <Tooltip 
                      open={showLanguageTooltip}
                      onOpenChange={setShowLanguageTooltip}
                      delayDuration={0}
                    >
                      <TooltipTrigger asChild>
                        <button 
                          type="button"
                          className="focus:outline-none"
                          onMouseEnter={() => setShowLanguageTooltip(true)}
                          onMouseLeave={() => setShowLanguageTooltip(false)}
                        >
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-500 transition-colors" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className="max-w-xs bg-gray-900 text-gray-100 border border-gray-700"
                        sideOffset={5}
                      >
                        <div className="space-y-2">
                          <p className="font-medium">Target Language</p>
                          <p className="text-sm text-gray-200">
                            Subtitles will be generated in this language. Choose the language that best suits your audience.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                  disabled={isUploading}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Choose subtitle language" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={8} className="bg-white z-[110]">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem 
                        key={lang.code} 
                        value={lang.code}
                        className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
                      >
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Enhanced Dubbing Toggle */}
              <div className={cn(
                "p-4 rounded-lg border transition-colors duration-200",
                enableDubbing 
                  ? "bg-blue-50/50 border-blue-200 shadow-sm" 
                  : "bg-gray-50 border-gray-200"
              )}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                      "mt-1 p-2 rounded-lg transition-colors duration-200",
                      enableDubbing ? "bg-blue-100" : "bg-gray-100"
                    )}>
                      <Subtitles className={cn(
                        "w-5 h-5 transition-colors duration-200",
                        enableDubbing ? "text-blue-600" : "text-gray-600"
                      )} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-medium transition-colors duration-200",
                          enableDubbing ? "text-blue-900" : "text-gray-700"
                        )}>
                          Audio Dubbing
                        </span>
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger>
                              <Info className={cn(
                                "w-4 h-4 transition-colors duration-200",
                                enableDubbing ? "text-blue-400" : "text-gray-400"
                              )} />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs bg-gray-900 text-gray-100 border border-gray-700">
                              <div className="space-y-2">
                                <p className="font-medium">Audio Dubbing Feature</p>
                                <p className="text-sm text-gray-200">
                                  When enabled, we'll use advanced AI to dub your video in the target language. 
                                  The dubbed version will maintain natural voice qualities while matching lip movements.
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">
                        AI will dub your video in the target language
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enableDubbing}
                    onClick={() => setEnableDubbing(!enableDubbing)}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      enableDubbing ? "bg-blue-600" : "bg-gray-200"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        enableDubbing ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {/* Additional Info when dubbing is enabled */}
                {enableDubbing && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-start gap-2 text-xs text-blue-700">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>
                        The dubbing process may take a few minutes. You'll be able to preview and download 
                        both the original and dubbed versions once complete.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={selectedFile ? handleUpload : handleUploadClick}
                disabled={isUploading || (selectedFile && !selectedLanguage)}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing video...
                  </>
                ) : selectedFile ? (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Generate Subtitles
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

      {/* Empty State */}
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
          <p className="text-gray-500 mb-4 max-w-sm mx-auto">
            Upload your first video and let SubtleAI generate accurate subtitles for you in minutes.
          </p>
          <div className="max-w-sm mx-auto mb-6 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 text-left">
            <div className="font-medium mb-1">File requirements:</div>
            <ul className="list-disc list-inside space-y-1 text-blue-600">
              <li>Maximum file size: 20 MB</li>
              <li>Supported formats: MP4, WAV, WebM</li>
            </ul>
          </div>
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
