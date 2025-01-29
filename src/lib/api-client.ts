import axios from 'axios';

const API_BASE_URL = import.meta.env.VIDEO_ANALYZER_API_URL;

if (!API_BASE_URL) {
  throw new Error('VIDEO_ANALYZER_API_URL environment variable is not set');
}

// Auth Types
export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    email: string;
    created_at: string;
  } | null;
}

// Video Types
export interface Video {
  uuid: string;
  video_url: string;
  original_name: string | null;
  duration_minutes: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  has_subtitles: boolean;
  subtitle_languages: string[];
  subtitles: Subtitle[];
}

export interface VideoListResponse {
  message: string;
  count: number;
  videos: Video[];
  detail?: string;
}

export interface VideoUploadRequest {
  file: File;
  language: string;
}

export interface VideoUploadResponse {
  message: string;
  video_uuid: string;
  file_url: string;
  status: string | null;
  detail?: string;
}

export interface VideoDeleteResponse {
  message: string;
  video_uuid: string;
  detail?: string;
}

// Subtitle Types
export interface Subtitle {
  uuid: string;
  language: string;
  subtitle_url: string;
  created_at: string;
}

export interface SubtitleListResponse {
  message: string;
  count: number;
  subtitles: Subtitle[];
}

export interface SubtitleGenerationResponse {
  message: string;
  video_uuid: string;
  subtitle_uuid: string;
  subtitle_url: string;
  language: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  duration_minutes: number;
  processing_cost: number;
  detail: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

export const auth = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    clearAuthToken();
  },
};

export const videos = {
  async list(include_subtitles: boolean = true): Promise<VideoListResponse> {
    const response = await apiClient.get('/videos/', {
      params: { include_subtitles }
    });
    return response.data;
  },

  async upload({ file, language }: VideoUploadRequest): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    const response = await apiClient.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(videoUuid: string): Promise<VideoDeleteResponse> {
    const response = await apiClient.delete(`/videos/${videoUuid}`);
    return response.data;
  },

  async generateSubtitles(videoUuid: string, language: string = 'en'): Promise<SubtitleGenerationResponse> {
    const response = await apiClient.post(`/videos/${videoUuid}/generate_subtitles`, {
      language
    });
    return response.data;
  },
};

export const subtitles = {
  async list(): Promise<SubtitleListResponse> {
    const response = await apiClient.get('/subtitles/');
    return response.data;
  },

  async download(subtitleUuid: string): Promise<Blob> {
    const response = await apiClient.get(`/subtitles/${subtitleUuid}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default apiClient; 