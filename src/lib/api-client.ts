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
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface VideoListResponse {
  message: string;
  count: number;
  videos: Video[];
  detail?: string;
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
  video_uuid: string;
  subtitle_url: string;
  format: string | null;
  created_at: string | null;
  updated_at: string | null;
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
  status: string | null;
  detail?: string;
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
  async list(): Promise<VideoListResponse> {
    const response = await apiClient.get('/videos/');
    return response.data;
  },

  async upload(file: File): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

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

  async generateSubtitles(videoUuid: string): Promise<SubtitleGenerationResponse> {
    const response = await apiClient.post(`/videos/${videoUuid}/generate_subtitles`);
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