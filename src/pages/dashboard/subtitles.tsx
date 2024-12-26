import React, { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { subtitles } from '@/lib/api-client';
import type { Subtitle } from '@/lib/api-client';

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
      a.download = `subtitles-${subtitle.video_uuid}.${subtitle.format || 'srt'}`;
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

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Generated Subtitles</h1>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {subtitleList.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No subtitles generated yet
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subtitleList.map((subtitle) => (
                <tr key={subtitle.uuid}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subtitle.video_uuid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subtitle.format || 'SRT'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subtitle.created_at ? new Date(subtitle.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(subtitle)}
                      disabled={downloadingId === subtitle.uuid}
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
        )}
      </div>
    </div>
  );
}