import React, { useState, useEffect } from 'react';
import { Download, Loader2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingBar } from '@/components/ui/loading-bar';
import { subtitles, SUPPORTED_LANGUAGES } from '@/lib/api-client';
import type { Subtitle } from '@/lib/api-client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SubtitlesPage() {
  const [subtitleList, setSubtitleList] = useState<Subtitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchSubtitles = async () => {
    try {
      setIsLoading(true);
      const response = await subtitles.list();
      setSubtitleList(response.subtitles);
      setError(null);
    } catch (err) {
      setError('Failed to load subtitles');
      console.error('Error fetching subtitles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubtitles();
  }, []);

  const handleDownload = async (subtitle: Subtitle) => {
    try {
      setDownloadingId(subtitle.uuid);
      const blob = await subtitles.download(subtitle.uuid);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = subtitle.video_original_name 
        ? `${subtitle.video_original_name.split('.')[0]}_${subtitle.language}.${subtitle.format || 'srt'}`
        : `subtitles_${subtitle.video_uuid}_${subtitle.language}.${subtitle.format || 'srt'}`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download subtitles');
      console.error('Error downloading subtitles:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (date: Date) => {
    // Format: Jan 29, 2024
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    // Format: 10:55 AM
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <>
        <LoadingBar isLoading={isLoading} />
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Generated Subtitles</h1>
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-t-lg w-full"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 border-b w-full"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Generated Subtitles</h1>
        <p className="text-gray-600 mb-6">Download and manage your generated subtitles</p>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {subtitleList.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No subtitles generated yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subtitleList.map((subtitle) => (
                    <tr key={subtitle.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {subtitle.video_original_name || 
                            `Video ${subtitle.video_uuid.split('-')[0]}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {SUPPORTED_LANGUAGES[subtitle.language] || subtitle.language.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 uppercase">
                          {subtitle.format || 'SRT'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="cursor-default">
                              {formatDate(new Date(subtitle.created_at))}
                            </TooltipTrigger>
                            <TooltipContent>
                              Generated at {formatTime(new Date(subtitle.created_at))}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(subtitle)}
                          disabled={downloadingId === subtitle.uuid}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg transition-all duration-200"
                        >
                          {downloadingId === subtitle.uuid ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}