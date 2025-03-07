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
  Subtitles,
  Palette,
  Bold,
  Italic,
  ArrowUpDown,
  Type,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { videos, subtitles, users, type Video, type Subtitle, type UserDetails, type SupportedLanguageType, type VideoUploadResponse, ProcessingType, type VideoUploadRequest } from '@/lib/api-client';
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
import toast from 'react-hot-toast';
import { useUserDetails } from '@/hooks/use-user-details';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useUserChannel, type ChannelMessage } from '@/hooks/useUserChannel';
import { Label } from '@/components/ui/label';

const SUPPORTED_LANGUAGES = [
  { code: 'en' as SupportedLanguageType, name: 'English' },
  { code: 'es' as SupportedLanguageType, name: 'Spanish' },
  { code: 'fr' as SupportedLanguageType, name: 'French' },
  { code: 'de' as SupportedLanguageType, name: 'German' },
  { code: 'ja' as SupportedLanguageType, name: 'Japanese' },
  { code: 'ru' as SupportedLanguageType, name: 'Russian' },
  { code: 'it' as SupportedLanguageType, name: 'Italian' },
  { code: 'zh' as SupportedLanguageType, name: 'Chinese' },
  { code: 'tr' as SupportedLanguageType, name: 'Turkish' },
  { code: 'ko' as SupportedLanguageType, name: 'Korean' },
  { code: 'pt' as SupportedLanguageType, name: 'Portuguese' }
] as const;

interface SubtitleStyle {
  fontSize: 'small' | 'medium' | 'large';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  position: 'bottom' | 'top';
  alignment: 'left' | 'center' | 'right';
}

function VideoCard({ 
  video, 
  onDelete, 
  onVideoUpdate,
  voiceoverSettings
}: { 
  video: Video; 
  onDelete: (videoId: string) => void;
  onVideoUpdate: (updatedVideo: Video) => void;
  voiceoverSettings?: { description: string; speed: number };
}) {
  const [isSubtitleDownloading, setIsSubtitleDownloading] = useState<string | null>(null);
  const [isOriginalDownloading, setIsOriginalDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showProcessedVersion, setShowProcessedVersion] = useState(true);
  const [showBurnedVersion, setShowBurnedVersion] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update showBurnedVersion when burned_video_url changes
  useEffect(() => {
    if (video.burned_video_url) {
      setShowBurnedVersion(true);
    }
  }, [video.burned_video_url]);

  // Update showProcessedVersion when processed_video_url changes
  useEffect(() => {
    if (video.processed_video_url) {
      setShowProcessedVersion(true);
    }
  }, [video.processed_video_url]);

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

  const handleDownload = async (source: Subtitle | string, type: 'subtitle' | 'original' = 'subtitle') => {
    try {
      if (type === 'subtitle' && typeof source !== 'string') {
        const subtitle = source as Subtitle;
        setIsSubtitleDownloading(subtitle.uuid);
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
      } else if (type === 'original' && typeof source === 'string') {
        setIsOriginalDownloading(true);
        const response = await fetch(source);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = video.original_name 
          ? video.original_name
          : `original_video_${video.uuid}.mp4`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download. Please try again.');
    } finally {
      if (type === 'subtitle') {
        setIsSubtitleDownloading(null);
      } else {
        setIsOriginalDownloading(false);
      }
    }
  };

  const handleGenerateSubtitles = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const updatedVideo: Video = {
        ...video,
        status: 'processing',
        processingMessage: 'Generating Subtitles...'
      };
      onVideoUpdate(updatedVideo);

      const defaultLanguage: SupportedLanguageType = 'en';
      
      let apiOptions: {
        description?: string;
        speed?: number;
      } = {};
      
      // Only add description and speed if processing type is voiceover
      if (video.processing_type === 'voiceover') {
        // Use saved settings if available, otherwise use empty string for description
        apiOptions.description = voiceoverSettings?.description || "";
        apiOptions.speed = voiceoverSettings?.speed || 1.0;
      }
      
      const response = await videos.generateSubtitles(
        video.uuid, 
        video.subtitle_languages[0] || defaultLanguage,
        apiOptions
      );
      
      if (response.status === 'completed' && response.subtitle_uuid && response.subtitle_url && response.language) {
        // Only call burn_subtitles if not dubbing or voiceover
        if (video.processing_type === 'subtitles' && response.subtitle_uuid) {
          try {
            // Update message before burning subtitles
            onVideoUpdate({
              ...updatedVideo,
              processingMessage: 'Burning Subtitles...'
            });

            const burnResponse = await videos.burnSubtitles(
              video.uuid,
              response.subtitle_uuid
            );

            if (burnResponse.status === 'completed') {
              toast.success('Subtitles generated and burned successfully!');
              const completedVideo: Video = { 
                ...video, 
                status: 'completed', 
                has_subtitles: true,
                burned_video_url: burnResponse.burned_video_url,
                processed_video_url: null,
                dubbing_id: null,
                is_dubbed_audio: false,
                subtitle_languages: [response.language as SupportedLanguageType],
                subtitles: [{
                  uuid: response.subtitle_uuid,
                  language: response.language as SupportedLanguageType,
                  subtitle_url: response.subtitle_url,
                  created_at: new Date().toISOString(),
                  video_uuid: video.uuid,
                  video_original_name: video.original_name,
                  format: 'srt',
                  updated_at: new Date().toISOString()
                }]
              };
              onVideoUpdate(completedVideo);
            }
          } catch (burnError) {
            console.error('Error burning subtitles:', burnError);
            toast.error('Failed to burn subtitles into video');
          }
        } else {
          // For dubbing/voiceover flow, update message for polling
          if (response.dubbing_id) {
            onVideoUpdate({
              ...updatedVideo,
              dubbing_id: response.dubbing_id,
              processingMessage: video.processing_type === 'dubbing' ? 'Dubbing Audio...' : 'Generating Voiceover...'
            });
          }
        }
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
      const failedVideo: Video = {
        ...video,
        status: 'failed'
      };
      onVideoUpdate(failedVideo);

      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update the polling logic to maintain the "Dubbing Audio..." message
  useEffect(() => {
    if (video.dubbing_id && !video.processed_video_url) {
      // Keep "Dubbing Audio..." message during polling
      onVideoUpdate({
        ...video,
        status: 'processing',
        processingMessage: video.processing_type === 'dubbing' ? 'Dubbing Audio...' : 'Generating Voiceover...'
      });
    }
  }, [video.dubbing_id, video.processed_video_url]);

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

  // Function to get button color based on current state
  const getButtonColorClass = () => {
    if (video.processed_video_url && showProcessedVersion) {
      return "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/25";
    } else if (!video.processed_video_url && video.burned_video_url && showBurnedVersion) {
      return "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-blue-500/25";
    }
    return "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-lg shadow-slate-500/25";
  };

  // Function to determine which video URL to show
  const getVideoSource = () => {
    if (video.processing_type === 'dubbing' && video.burned_video_url && !showProcessedVersion && !showBurnedVersion) {
      return video.video_url;
    } else if (video.processing_type === 'dubbing' && video.burned_video_url) {
      return video.burned_video_url;
    } else if (video.processed_video_url && showProcessedVersion) {
      return video.processed_video_url;
    } else if (video.burned_video_url && showBurnedVersion) {
      return video.burned_video_url;
    }
    return video.video_url;
  };

  // Function to get the current video state label
  const getCurrentStateLabel = () => {
    if (video.processed_video_url && showProcessedVersion) {
      return video.processing_type === 'dubbing' ? 'Dubbed' : 'VoicedOver';
    } else if (video.burned_video_url && showBurnedVersion) {
      return video.processing_type === 'voiceover' ? 'VoicedOver' : 'Subtitled';
    }
    return 'Original';
  };

  // Function to get the next state label for tooltip
  const getNextStateLabel = () => {
    if (video.processed_video_url) {
      return showProcessedVersion ? 'original' : (video.processing_type === 'dubbing' ? 'dubbed' : 'voicedover');
    }
    return showBurnedVersion ? 'original' : (video.processing_type === 'voiceover' ? 'voicedover' : 'subtitled');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      {/* Video Preview Section */}
      <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden relative">
        {(video.video_url || video.processed_video_url || video.burned_video_url) && (
          <>
            <video
              key={`${video.uuid}-${showProcessedVersion}-${showBurnedVersion}-${getVideoSource()}`}
              src={getVideoSource()}
              className="w-full h-full object-cover"
              controls
              crossOrigin="anonymous"
            >
              Your browser does not support the video tag.
            </video>
            {(video.status === 'processing' || video.status === 'uploading') && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    {video.processingMessage || (video.processing_type === 'voiceover' ? 'Generating Voiceover...' : 'Generating Subtitles...')}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
        {/* Video Source Switch */}
        <div className="absolute top-2 left-2 flex gap-2">
          {/* Case 3 & 4: Dubbed video */}
          {video.processed_video_url && video.status === 'completed' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setShowProcessedVersion(!showProcessedVersion);
                      // Also reset burned version when switching to original
                      if (showProcessedVersion) {
                        setShowBurnedVersion(false);
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-colors duration-200 flex items-center gap-2 hover:scale-105 active:scale-95",
                      showProcessedVersion
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/25"
                        : "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-lg shadow-slate-500/25",
                      "animate-pulse-once cursor-pointer"
                    )}
                  >
                    {getCurrentStateLabel()}
                    <ArrowRight className="w-3 h-3 animate-bounce-x" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-gray-100 border border-gray-700">
                  <p>Switch to {getNextStateLabel()} version</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Case 2: Non-dubbed video with burned URL */}
          {!video.processed_video_url && video.burned_video_url && video.status === 'completed' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowBurnedVersion(!showBurnedVersion)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-colors duration-200 flex items-center gap-2 hover:scale-105 active:scale-95",
                      showBurnedVersion
                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-blue-500/25"
                        : "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-lg shadow-slate-500/25",
                      "animate-pulse-once cursor-pointer"
                    )}
                  >
                    {getCurrentStateLabel()}
                    <ArrowRight className="w-3 h-3 animate-bounce-x" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-gray-100 border border-gray-700">
                  <p>Switch to {getNextStateLabel()} version</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
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
              <TooltipContent className="bg-gray-900 text-gray-100 border border-gray-700">
                Delete video
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Actions Section */}
        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          {video.status === 'completed' && video.has_subtitles && (
            <div className="w-full">
              <div className="flex flex-col gap-3">
                {/* Download Options */}
                <div className="flex items-center gap-4">
                  {/* Video Download */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(
                            getVideoSource(),
                            'original'
                          )}
                          disabled={isOriginalDownloading}
                          className={cn(
                            "relative flex-1 overflow-hidden group",
                            getButtonColorClass(),
                            "text-white border-0 shadow-md hover:shadow-lg transition-all duration-300",
                            "hover:scale-[1.02] active:scale-[0.98]",
                            isOriginalDownloading && "opacity-50"
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {isOriginalDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <div className="flex items-center gap-2 justify-center">
                              <Download className="w-4 h-4" />
                              {getCurrentStateLabel()}
                            </div>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-gray-100 border border-gray-700">
                        Download {getCurrentStateLabel()} Video
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Subtitle Download */}
                  {video.subtitles.map((subtitle) => (
                    <TooltipProvider key={subtitle.uuid}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(subtitle, 'subtitle')}
                            disabled={isSubtitleDownloading === subtitle.uuid}
                            className={cn(
                              "relative flex-1 overflow-hidden group",
                              "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0",
                              "shadow-md hover:shadow-lg transition-all duration-300",
                              "hover:scale-[1.02] active:scale-[0.98]",
                              "hover:from-violet-600 hover:to-purple-600",
                              isSubtitleDownloading === subtitle.uuid && "opacity-50"
                            )}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {isSubtitleDownloading === subtitle.uuid ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <div className="flex items-center gap-2 justify-center">
                                <Download className="w-4 h-4" />
                                {SUPPORTED_LANGUAGES.find(l => l.code === subtitle.language)?.name || subtitle.language} Subtitles
                              </div>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-900 text-gray-100 border border-gray-700">
                          Download {SUPPORTED_LANGUAGES.find(l => l.code === subtitle.language)?.name} subtitles
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
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

function SubtitleStyleModal({ 
  videoUrl, 
  onClose,
  onSave,
}: { 
  videoUrl: string;
  onClose: () => void;
  onSave: (style: SubtitleStyle) => void;
}) {
  const [style, setStyle] = useState<SubtitleStyle>({
    fontSize: 'medium',
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#FFFFFF',
    position: 'bottom',
    alignment: 'center'
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Sample text with multiple examples
  const sampleText = [
    "Your subtitles appear here, just like this!",
    "This is a preview of your subtitles in action.",
    "Personalize your subtitles to match your style.",
    "Try different positions, colors, and fonts!"
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Rotate through sample text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % sampleText.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setLoadError('Preview generation timed out. Using default preview.');
        setIsLoading(false);
      }
    }, 3000);

    const handleLoad = () => {
      setIsLoading(false);
      clearTimeout(timeoutId);
    };

    const handleError = () => {
      setLoadError('Failed to load video preview. Using default preview.');
      setIsLoading(false);
      clearTimeout(timeoutId);
    };

    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('error', handleError);
    video.src = videoUrl;

    return () => {
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('error', handleError);
      clearTimeout(timeoutId);
    };
  }, [videoUrl]);

  const getSubtitleStyle = () => {
    // These are the core styles that will be saved and sent to the API
    const savedStyles = {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      color: style.color,
      position: style.position,
      alignment: style.alignment
    };

    // These are additional styles only for preview
    const previewStyles: React.CSSProperties = {
      fontSize: {
        small: '16px',
        medium: '24px',
        large: '32px'
      }[style.fontSize],
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      color: style.color,
      padding: '12px 24px',
      borderRadius: '8px',
      maxWidth: '90%',
      textAlign: style.alignment,
      transition: 'all 0.3s ease',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      whiteSpace: 'pre-line',
      width: style.alignment === 'center' ? 'fit-content' : '90%',
      margin: style.alignment === 'center' ? '0 auto' : style.alignment === 'left' ? '0' : '0 0 0 auto'
    };

    return previewStyles;
  };

  // Handle style save internally
  const handleSaveClick = () => {
    // Only save the core styles without any preview-specific properties
    const savedStyles = {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      color: style.color,
      position: style.position,
      alignment: style.alignment
    };
    
    // Call the onSave callback with the cleaned styles
    onSave(savedStyles);
    
    // Close the modal
    onClose();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[65]" />
      
      <Dialog open onOpenChange={onClose} modal>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-white backdrop-blur-xl z-[70] overflow-hidden border border-gray-200 rounded-xl shadow-xl">
          <div className="flex h-[calc(90vh-0px)]">
            {/* Video Preview Area - Left Side */}
            <div className="flex-1 p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white relative">
              {/* Header with Close Button */}
              <div className="absolute top-0 left-0 right-0 p-8 pb-6">
                <div className="relative">
                  <div className="flex flex-col gap-2 pb-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Customize Subtitle Style
                    </h2>
                    <p className="text-gray-600">
                      Preview and adjust how your subtitles will appear in the video
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative w-full max-w-5xl h-[500px] bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 shadow-xl mt-[70px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    <p className="text-sm text-gray-400">Loading preview...</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {/* Mock Video Player */}
                    <div className="absolute inset-0 flex flex-col">
                      {/* Video Player Header */}
                      <div className="p-4 bg-gradient-to-b from-gray-900/90 to-transparent backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/90"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500/90"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500/90"></div>
                            </div>
                            <span className="text-sm text-gray-300">Subtitle Preview</span>
                          </div>
                          <div className="px-2 py-1 rounded-md bg-gray-800/50 backdrop-blur-sm border border-gray-700/30">
                            <span className="text-xs text-gray-300">Preview Mode</span>
                          </div>
                        </div>
                      </div>

                      {/* Video Content Area */}
                      <div className="flex-1 relative">
                        {/* Video Thumbnail/Frame */}
                        <video
                          ref={videoRef}
                          src={videoUrl}
                          className="absolute inset-0 w-full h-full object-cover bg-black"
                          poster="/video-placeholder.jpg"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute inset-0 bg-black/40" />

                        {/* Subtitle Preview Container */}
                        <div className={cn(
                          "absolute left-0 right-0 px-8",
                          style.position === 'bottom' ? 'bottom-[15%]' : 'top-[15%]'
                        )}>
                          <div
                            style={getSubtitleStyle()}
                            className="animate-fade-in mx-auto backdrop-blur-sm bg-black/30 shadow-lg"
                          >
                            {sampleText[currentTextIndex]}
                          </div>
                        </div>
                      </div>

                      {/* Video Player Controls */}
                      <div className="p-4 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent backdrop-blur-sm border-t border-gray-700/20">
                        <div className="space-y-2">
                          <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <div className="w-1/3 h-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-300">0:42</span>
                              <div className="h-4 w-px bg-gray-700/50"></div>
                              <span className="text-sm text-gray-400">2:15</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="px-2 py-1 rounded-md bg-gray-800/50 backdrop-blur-sm border border-gray-700/30">
                                <span className="text-xs text-gray-300">HD 1080p</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {loadError && (
                      <div className="absolute top-4 left-4 right-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{loadError}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Styling Controls - Right Side */}
            <div className="w-[420px] flex flex-col border-l border-gray-200 bg-gray-50">
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                <div className="p-6">
                  {/* Font Settings */}
                  <div className="space-y-6">
                    <div className="pb-2 border-b-2 border-blue-100">
                      <h4 className="text-lg font-medium text-gray-800 flex items-center gap-3">
                        <span className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                          <Type className="w-5 h-5 text-blue-600" />
                        </span>
                        Font Settings
                      </h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Font Size</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['small', 'medium', 'large'].map((size) => (
                            <button
                              key={size}
                              onClick={() => setStyle({ ...style, fontSize: size as any })}
                              className={cn(
                                "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                                style.fontSize === size
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              {size.charAt(0).toUpperCase() + size.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setStyle({ 
                            ...style, 
                            fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' 
                          })}
                          className={cn(
                            "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2",
                            style.fontWeight === 'bold'
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <Bold className="w-4 h-4" />
                          Bold
                        </button>
                        <button
                          onClick={() => setStyle({ 
                            ...style, 
                            fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' 
                          })}
                          className={cn(
                            "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2",
                            style.fontStyle === 'italic'
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <Italic className="w-4 h-4" />
                          Italic
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Color Settings */}
                  <div className="space-y-6 mt-6">
                    <div className="pb-2 border-b-2 border-purple-100">
                      <h4 className="text-lg font-medium text-gray-800 flex items-center gap-3">
                        <span className="p-2.5 rounded-lg bg-purple-50 border border-purple-100">
                          <Palette className="w-5 h-5 text-purple-600" />
                        </span>
                        Color
                      </h4>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Text Color</label>
                      <div className="relative group">
                        <input
                          type="color"
                          id="textColor"
                          value={style.color}
                          onChange={(e) => setStyle({ ...style, color: e.target.value })}
                          className="sr-only"
                        />
                        <label
                          htmlFor="textColor"
                          className="relative block h-12 rounded-lg cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-all overflow-hidden"
                          style={{ backgroundColor: style.color }}
                        >
                          <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABCSURBVDiNY/z//z8DJYCJgUIw8AawIHN+//6NVR7GxsZGlgEsyJxfv35hlQczXDSQCkYNGDVg1IBRA0YNGEIDAAKoEQ3p8T1rAAAAAElFTkSuQmCC')] opacity-20" />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-1 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-mono text-gray-600">
                            {style.color.toUpperCase()}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Position Settings */}
                  <div className="space-y-6 mt-6">
                    <div className="pb-2 border-b-2 border-emerald-100">
                      <h4 className="text-lg font-medium text-gray-800 flex items-center gap-3">
                        <span className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                          <ArrowUpDown className="w-5 h-5 text-emerald-600" />
                        </span>
                        Position
                      </h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Vertical Position</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['top', 'bottom'].map((pos) => (
                            <button
                              key={pos}
                              onClick={() => setStyle({ ...style, position: pos as any })}
                              className={cn(
                                "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                                style.position === pos
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              {pos.charAt(0).toUpperCase() + pos.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Alignment</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['left', 'center', 'right'].map((align) => (
                            <button
                              key={align}
                              onClick={() => setStyle({ ...style, alignment: align as any })}
                              className={cn(
                                "px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                                style.alignment === align
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                  : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              {align.charAt(0).toUpperCase() + align.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-700 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 relative group"
                    onClick={handleSaveClick}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <span className="relative">Save Style</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Add this CSS animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
`;
document.head.appendChild(styleSheet);

export function DashboardOverview() {
  const { user } = useAuth();
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguageType>('en');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchUserDetails } = useUserDetails();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingType, setProcessingType] = useState<ProcessingType>('subtitles');
  const [showLanguageTooltip, setShowLanguageTooltip] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle | null>(null);
  const [uploadedVideoUuid, setUploadedVideoUuid] = useState<string | null>(null);
  const [voiceDescription, setVoiceDescription] = useState('');
  const [speakingSpeed, setSpeakingSpeed] = useState(1.0);
  const [isVoiceSettingsExpanded, setIsVoiceSettingsExpanded] = useState(false);
  const [showVoiceoverModal, setShowVoiceoverModal] = useState(false);
  const [voiceoverSettings, setVoiceoverSettings] = useState<{ description: string; speed: number }>({ description: '', speed: 1.0 });

  const fetchVideos = async () => {
    try {
      const response = await videos.list(true);
      setVideoList(response.videos);
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

        // Upload video with subtitle style if available
        let uploadResponse: VideoUploadResponse;
        try {
          uploadResponse = await videos.upload({
            file: selectedFile,
            language: selectedLanguage,
            subtitleStyle: subtitleStyle || undefined,
            processing_type: processingType as ProcessingType
          } as VideoUploadRequest);

          // Reset modal state and close it
          setIsUploadModalOpen(false);
          setSelectedFile(null);
          setSelectedLanguage('en');
          setError(null);
          setProcessingType('subtitles');
          setShowLanguageTooltip(false);
          setIsUploading(false);
          setVideoPreviewUrl(null);
          // Clear subtitle style after successful upload
          setSubtitleStyle(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
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

        // Add video to list with initial processing message
        const newVideo: Video = {
          uuid: uploadResponse.video_uuid,
          video_url: uploadResponse.file_url,
          original_name: selectedFile.name,
          duration_minutes: 0,
          status: 'processing',
          processingMessage: processingType === 'voiceover' 
            ? 'Generating Voiceover...' 
            : processingType === 'dubbing' 
              ? 'Dubbing Audio...' 
              : 'Generating Subtitles...',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          has_subtitles: false,
          subtitle_languages: [],
          subtitles: [],
          processed_video_url: null,
          dubbing_id: null,
          is_dubbed_audio: false,
          burned_video_url: null,
          processing_type: processingType as ProcessingType
        };

        setVideoList(prev => [newVideo, ...prev]);
        
        // Reset modal state and close it
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setSelectedLanguage('en');
        setError(null);
        setProcessingType('subtitles');
        setShowLanguageTooltip(false);
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        try {
          // Generate subtitles
          let apiOptions: {
            description?: string;
            speed?: number;
          } = {};
          
          // Only add description and speed if processing type is voiceover
          if (processingType === 'voiceover') {
            // Use saved settings if available, otherwise use empty string for description
            apiOptions.description = voiceoverSettings?.description || "";
            apiOptions.speed = voiceoverSettings?.speed || 1.0;
          }
          
          const generationResponse = await videos.generateSubtitles(
            uploadResponse.video_uuid,
            selectedLanguage,
            apiOptions
          );

          if (processingType !== 'subtitles' && generationResponse.dubbing_id) {
            // Update video with appropriate message
            setVideoList(prev => prev.map(v => 
              v.uuid === uploadResponse.video_uuid 
                ? { 
                    ...v, 
                    processingMessage: processingType === 'dubbing' ? 'Dubbing Audio...' : 'Generating Voiceover...'
                  }
                : v
            ));

            // Start polling for dubbing status
            const pollDubbingStatus = async () => {
              if (!generationResponse.dubbing_id) return;
              
              try {
                const statusResponse = await videos.checkDubbingStatus(
                  uploadResponse.video_uuid,
                  generationResponse.dubbing_id
                );

                if (statusResponse.status === 'dubbed') {
                  try {
                    // First get the dubbed video
                    const dubbedVideoResponse = await videos.getDubbedVideo(
                      uploadResponse.video_uuid,
                      generationResponse.dubbing_id
                    );

                    // Then get the transcript
                    const transcriptResponse = await videos.getTranscriptForDub(
                      uploadResponse.video_uuid,
                      generationResponse.dubbing_id
                    );

                    if (transcriptResponse.language && transcriptResponse.subtitle_uuid && transcriptResponse.subtitle_url) {
                      const language = transcriptResponse.language as SupportedLanguageType;

                      // Call burn_subtitles API with the transcript
                      const burnResponse = await videos.burnSubtitles(
                        uploadResponse.video_uuid,
                        transcriptResponse.subtitle_uuid
                      );

                      const subtitles: Array<Subtitle> = [{
                        uuid: transcriptResponse.subtitle_uuid,
                        language: language,
                        subtitle_url: transcriptResponse.subtitle_url,
                        created_at: new Date().toISOString(),
                        video_uuid: uploadResponse.video_uuid,
                        video_original_name: selectedFile.name,
                        format: 'srt',
                        updated_at: new Date().toISOString()
                      }];
                      
                      const subtitle_languages: Array<SupportedLanguageType> = [language];
                      
                      // Update video in list with dubbed info and burned video URL
                      const updatedVideo = {
                        uuid: uploadResponse.video_uuid,
                        video_url: newVideo.video_url,
                        original_name: selectedFile.name,
                        status: 'completed' as const,
                        duration_minutes: statusResponse.duration_minutes || 0,
                        has_subtitles: true,
                        subtitle_languages,
                        subtitles,
                        processed_video_url: dubbedVideoResponse.processed_video_url,
                        dubbing_id: generationResponse.dubbing_id,
                        is_dubbed_audio: true,
                        burned_video_url: burnResponse.burned_video_url,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        processing_type: processingType
                      } as Video;

                      // Update video in list
                      setVideoList((prev: Array<Video>) => prev.map((v) => 
                        v.uuid === uploadResponse.video_uuid ? updatedVideo : v
                      ));

                      // Update user details to reflect usage
                      await fetchUserDetails();

                      return;
                    }
                  } catch (error) {
                    console.error('Error getting dubbed video or transcript:', error);
                    // Continue polling even on error
                    setTimeout(pollDubbingStatus, 5000);
                  }
                } else {
                  // Continue polling if not dubbed yet
                  setTimeout(pollDubbingStatus, 5000);
                }
              } catch (error) {
                console.error('Error checking dubbing status:', error);
                // Continue polling even on error
                setTimeout(pollDubbingStatus, 5000);
              }
            };

            // Start polling
            pollDubbingStatus();

            if (processingType === 'dubbing' || processingType === 'voiceover') {
              // Update message for dubbing/voiceover processing
              setVideoList(prev => prev.map(v => 
                v.uuid === uploadResponse.video_uuid 
                  ? { ...v, processingMessage: processingType === 'dubbing' ? 'Dubbing Audio...' : 'Generating Voiceover...' }
                  : v
              ));
              return "Video uploaded. Processing in progress...";
            }

            return "Video uploaded and subtitles generated successfully!";
          }

          // If we have a subtitle_uuid, proceed with burning subtitles
          if (generationResponse.subtitle_uuid) {
            // Update message for burning subtitles
            setVideoList(prev => prev.map(v => 
              v.uuid === uploadResponse.video_uuid 
                ? { ...v, processingMessage: 'Burning Subtitles...' }
                : v
            ));

            try {
              const burnResponse = await videos.burnSubtitles(
                uploadResponse.video_uuid,
                generationResponse.subtitle_uuid
              );

              if (burnResponse.status === 'completed' && generationResponse.language) {
                // Update video with both subtitle and burned video info
                const updatedVideo: Video = {
                  ...newVideo,
                  status: 'completed',
                  has_subtitles: true,
                  burned_video_url: burnResponse.burned_video_url,
                  subtitle_languages: [generationResponse.language as SupportedLanguageType],
                  subtitles: [{
                    uuid: generationResponse.subtitle_uuid,
                    language: generationResponse.language as SupportedLanguageType,
                    subtitle_url: generationResponse.subtitle_url || '',
                    created_at: new Date().toISOString(),
                    video_uuid: uploadResponse.video_uuid,
                    video_original_name: selectedFile.name,
                    format: 'srt',
                    updated_at: new Date().toISOString()
                  }]
                };

                // Update video in list
                setVideoList(prev => prev.map(v => 
                  v.uuid === uploadResponse.video_uuid ? updatedVideo : v
                ));

                // Update user details to reflect usage
                await fetchUserDetails();

                return "Video uploaded and subtitles burned successfully!";
              }
            } catch (burnError) {
              console.error('Error burning subtitles:', burnError);
              throw new Error('Failed to burn subtitles into video');
            }
          }

          // Refresh user details to update minutes
          await fetchUserDetails();

          return processingType === 'subtitles'
            ? "Video uploaded and subtitles generated successfully!"
            : "Video uploaded. Dubbing and subtitle generation in progress...";
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

  const handleVideoUpdate = (updatedVideo: Video) => {
    setVideoList((prevList: Video[]) => prevList.map((v: Video) => 
      v.uuid === updatedVideo.uuid ? updatedVideo : v
    ));
  };

  // Handle style save
  const handleStyleSave = (style: SubtitleStyle) => {
    // Update local state with the saved style
    setSubtitleStyle(style);
    // Close the modal
    setShowStyleModal(false);
    // Show success toast
    toast.success("Subtitle style saved!");
  };

  // Add user channel subscription
  useUserChannel((message: ChannelMessage) => {
    console.log('User channel message:', message);
    switch (message.type) {
      case 'VIDEO_STATUS_UPDATE':
        if (message.data?.video) {
          handleVideoUpdate(message.data.video);
        }
        break;
      case 'PROFILE_UPDATED':
        // Handle profile updates if needed
        break;
      case 'USER_LOGOUT':
        // Handle forced logout if needed
        break;
      default:
        // Removed console.log for unhandled message types
        break;
    }
  });

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
          Upload videos and generate accurate AI-powered subtitles and dubbed audio in multiple languages
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
      <Dialog 
        open={isUploadModalOpen} 
        onOpenChange={(open) => {
          if (!open) {
            // Reset all states when modal is closed
            setSelectedFile(null);
            setSelectedLanguage('en');
            setError(null);
            setProcessingType('subtitles');
            setShowLanguageTooltip(false);
            setIsUploading(false);
            setVideoPreviewUrl(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
          setIsUploadModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[500px] z-[60] bg-white max-h-[85vh] flex flex-col overflow-hidden">
          <div className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="flex-none px-6 pt-6">
              <div className="flex items-center gap-2">
                <DialogTitle className='mb-4'>Upload Video</DialogTitle>
              </div>
              <DialogDescription className="space-y-2 mt-6">
                <p>Select a video file to process with AI</p>
                <div className="mt-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                  <div className="font-medium mb-1">File requirements:</div>
                  <ul className="list-disc list-inside space-y-1 text-blue-600">
                    <li>Maximum file size: 20 MB</li>
                    <li>Supported formats: MP4, WAV, WebM</li>
                  </ul>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 mb-6">
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
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 relative">
                      <div className="flex items-center gap-3 relative z-10">
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
                                className="text-gray-500 hover:text-gray-700 relative z-10"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-blue-600 font-medium">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Add Customize Subtitle Style Button */}
                      <Button
                        variant="outline"
                        className="w-full mt-4 relative bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 text-gray-600 hover:text-gray-800 border-2 border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
                        onClick={() => {
                          const videoUrl = URL.createObjectURL(selectedFile);
                          setVideoPreviewUrl(videoUrl);
                          setShowStyleModal(true);
                        }}
                      >
                        <div className="flex items-center gap-2 relative z-10">
                          <Palette className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                          <span>Customize Subtitle Style</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Target Language Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Target Language
                      </label>
                    </div>
                  </div>
                  <Select
                    value={selectedLanguage}
                    onValueChange={(value: SupportedLanguageType) => setSelectedLanguage(value)}
                    disabled={isUploading}
                  >
                    <SelectTrigger className="w-full bg-white focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Choose subtitle language" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={8} className="bg-white z-[110] max-h-[300px] overflow-y-auto">
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

                {/* Processing Type Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-gray-700">Processing Type</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs bg-gray-900 text-gray-100 border border-gray-700">
                          <div className="space-y-3">
                            <p className="font-medium">Processing Options:</p>
                            <div className="space-y-2">
                              <div>
                                <p className="font-medium text-blue-300">Subtitles Only</p>
                                <p className="text-sm text-gray-200">Generates accurate subtitles in your chosen target language</p>
                              </div>
                              <div>
                                <p className="font-medium text-blue-300">AI Dubbing</p>
                                <p className="text-sm text-gray-200">Translates audio while preserving original voice characteristics. Includes subtitles in the dubbed language.</p>
                              </div>
                              <div>
                                <p className="font-medium text-blue-300">AI Voice Over</p>
                                <p className="text-sm text-gray-200">Creates natural-sounding voice narration in target language. Includes matching subtitles.</p>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={processingType} onValueChange={setProcessingType}>
                    <SelectTrigger className="w-full bg-white focus:ring-0 focus:ring-offset-0 border-gray-200 hover:border-gray-300">
                      <SelectValue placeholder="Select processing type" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={8} className="bg-white z-[110]">
                      <SelectItem value="subtitles" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                        Subtitles Only
                      </SelectItem>
                      <SelectItem value="dubbing" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                        AI Dubbing
                      </SelectItem>
                      <SelectItem value="voiceover" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900">
                        AI Voice Over
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice Over Settings Button */}
                {processingType === 'voiceover' && (
                  <Button
                    variant="outline"
                    className="w-full relative bg-gradient-to-r from-purple-50 to-white hover:from-purple-100 hover:to-gray-50 text-gray-600 hover:text-gray-800 border-2 border-purple-200/80 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
                    onClick={() => setShowVoiceoverModal(true)}
                  >
                    <div className="flex items-center gap-2 relative z-10">
                      <Subtitles className="w-4 h-4 text-purple-500 group-hover:text-purple-600 transition-colors" />
                      <span>Configure Voiceover Settings</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                )}

                {/* Voice Over Settings Modal */}
                <Dialog 
                  open={showVoiceoverModal} 
                  onOpenChange={(open) => {
                    if (open) {
                      // Reset to default values when modal opens
                      setSpeakingSpeed(1.0);
                    }
                    setShowVoiceoverModal(open);
                  }}
                >
                  <DialogContent className="sm:max-w-[600px] z-[60] bg-white max-h-[85vh] flex flex-col p-0 overflow-hidden border border-gray-200 shadow-xl">
                    <DialogHeader className="p-6 pb-2">
                      <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Configure Voice Over Settings
                      </DialogTitle>
                      <DialogDescription className="text-gray-600 mt-2">
                        Customize how the AI voice should narrate your video content
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto py-4 px-6 space-y-8 border-y border-gray-100 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                      {/* Voice Description Section */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-medium text-gray-900">Voice Description</h4>
                        </div>
                        <div className="relative">
                          <textarea
                            placeholder="Example: This video showcases our new AI-powered smart home system, making everyday tasks easier and more efficient. It highlights key features like voice control, energy savings, and enhanced security, all designed to simplify your life."
                            className="w-full min-h-[160px] px-4 py-3 text-base rounded-lg bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-200 placeholder:text-gray-600 placeholder:text-sm text-gray-900"
                            value={voiceDescription}
                            onChange={(e) => setVoiceDescription(e.target.value)}
                          />
                          <div className="mt-3 px-4 py-3 rounded-lg bg-blue-50/50 border border-blue-200 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 16v-4"></path>
                              <path d="M12 8h.01"></path>
                            </svg>
                            <p className="text-sm text-gray-700">
                              This description will only be used if the video has no audio.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Speaking Speed Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-medium text-gray-900">Speaking Speed</h4>
                            <div className="relative group">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 cursor-help">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 16v-4"></path>
                                <path d="M12 8h.01"></path>
                              </svg>
                              <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                Controls the speed at which the AI voice narrates your video. Higher values make the speech faster, while lower values make it slower.
                              </div>
                            </div>
                          </div>
                          <div className="px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200">
                            <span className="text-sm font-medium text-gray-900">
                              {speakingSpeed}x
                            </span>
                          </div>
                        </div>
                        <div className="p-4 pt-8 pb-4 rounded-lg bg-white border border-blue-200 shadow-sm">
                          <div className="relative mb-2">
                            {/* Tick marks */}
                            <div className="absolute -top-6 left-0 w-full flex justify-between px-1">
                              <span className="text-xs font-medium text-gray-500">0.75x</span>
                              <span className="text-xs font-medium text-gray-500">0.85x</span>
                              <span className="text-xs font-medium text-gray-500">1.0x</span>
                              <span className="text-xs font-medium text-gray-500">1.1x</span>
                              <span className="text-xs font-medium text-gray-500">1.2x</span>
                            </div>
                            
                            {/* Tick marks line */}
                            <div className="absolute -top-2 left-0 w-full flex justify-between px-1">
                              <div className="h-2 w-0.5 bg-gray-300"></div>
                              <div className="h-2 w-0.5 bg-gray-300"></div>
                              <div className="h-2 w-0.5 bg-gray-300"></div>
                              <div className="h-2 w-0.5 bg-gray-300"></div>
                              <div className="h-2 w-0.5 bg-gray-300"></div>
                            </div>
                            
                            {/* Slider */}
                            <input
                              type="range"
                              min="0.75"
                              max="1.20"
                              step="0.05"
                              value={speakingSpeed}
                              onChange={(e) => setSpeakingSpeed(parseFloat(e.target.value))}
                              className="w-full h-1.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-full appearance-none cursor-pointer
                              [&::-webkit-slider-thumb]:w-5 
                              [&::-webkit-slider-thumb]:h-5 
                              [&::-webkit-slider-thumb]:appearance-none 
                              [&::-webkit-slider-thumb]:bg-black 
                              [&::-webkit-slider-thumb]:rounded-full 
                              [&::-webkit-slider-thumb]:border-2
                              [&::-webkit-slider-thumb]:border-black
                              [&::-webkit-slider-thumb]:shadow-md
                              [&::-webkit-slider-thumb]:transition-all
                              [&::-webkit-slider-thumb]:duration-150
                              [&::-webkit-slider-thumb]:hover:scale-110
                              [&::-webkit-slider-thumb]:hover:shadow-lg
                              group"
                            />
                            
                            {/* Current value indicator - only shows on hover */}
                            <div 
                              className="absolute top-6 left-0 transform -translate-x-1/2 transition-all duration-150 opacity-0 group-hover:opacity-100"
                              style={{ 
                                left: `${((speakingSpeed - 0.75) / (1.20 - 0.75)) * 100}%`
                              }}
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-0.5 h-3 bg-black"></div>
                                <div className="px-2 py-1 bg-black text-white text-xs font-medium rounded-md shadow-sm">
                                  {speakingSpeed}x
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 p-6 bg-blue-50/50 border-t border-blue-100">
                      <Button
                        variant="outline"
                        onClick={() => setShowVoiceoverModal(false)}
                        className="border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // Save the voice description and speed for later use
                          setVoiceoverSettings({
                            description: voiceDescription,
                            speed: speakingSpeed
                          });
                          setShowVoiceoverModal(false);
                        }}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <span className="relative">Save Settings</span>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {processingType !== 'subtitles' && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-start gap-2 text-xs text-blue-700">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>
                        The AI processing may take a few minutes. You'll be able to preview and download 
                        both the original and processed versions once complete.
                      </p>
                    </div>
                  </div>
                )}                
              </div>
            </div>

            <div className="flex-none px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Button
                onClick={selectedFile ? handleUpload : handleUploadClick}
                disabled={isUploading || (!!selectedFile && !selectedLanguage)}
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
                    Start Processing
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

      {/* Subtitle Style Modal */}
      {showStyleModal && videoPreviewUrl && (
        <SubtitleStyleModal
          videoUrl={videoPreviewUrl}
          onClose={() => {
            setShowStyleModal(false);
            URL.revokeObjectURL(videoPreviewUrl);
            setVideoPreviewUrl(null);
          }}
          onSave={handleStyleSave}
        />
      )}

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
            onVideoUpdate={handleVideoUpdate}
            voiceoverSettings={voiceoverSettings}
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
