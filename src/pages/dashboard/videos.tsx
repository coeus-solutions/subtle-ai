import React, { useState, useEffect, useRef } from 'react';
import { Video, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { videos } from '@/lib/api-client';
import type { Video as VideoType } from '@/lib/api-client';

export function VideosPage() {
  const [videoList, setVideoList] = useState<VideoType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await videos.list();
      setVideoList(response.videos);
      setError(null);
    } catch (err) {
      setError('Failed to load videos');
      console.error('Error fetching videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress('Uploading video...');
      
      // Step 1: Upload the video
      const uploadResponse = await videos.upload(file);
      setUploadProgress('Generating subtitles...');
      
      // Step 2: Generate subtitles using the video UUID
      await videos.generateSubtitles(uploadResponse.video_uuid);
      
      // Step 3: Refresh the video list
      await fetchVideos();
      setError(null);
      setUploadProgress('');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  const handleDelete = async (videoUuid: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await videos.delete(videoUuid);
      await fetchVideos(); // Refresh the list
      setError(null);
    } catch (err) {
      setError('Failed to delete video');
      console.error('Error deleting video:', err);
    }
  };

  const handleGenerateSubtitles = async (videoUuid: string) => {
    try {
      await videos.generateSubtitles(videoUuid);
      setError(null);
      // Refresh the video list to update status
      await fetchVideos();
    } catch (err) {
      setError('Failed to generate subtitles');
      console.error('Error generating subtitles:', err);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Uploaded Videos</h1>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button 
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? uploadProgress || 'Processing...' : 'Upload Video'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {videoList.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No videos uploaded yet
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {videoList.map((video) => (
                <tr key={video.uuid}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={video.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {video.video_url.split('/').pop()}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      video.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {video.status || 'Processing'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {video.created_at ? new Date(video.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {video.status !== 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGenerateSubtitles(video.uuid)}
                      >
                        Generate Subtitles
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(video.uuid)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
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