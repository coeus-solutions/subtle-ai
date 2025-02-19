import axios from 'axios';

const API_BASE_URL = import.meta.env.VIDEO_ANALYZER_API_URL;

if (!API_BASE_URL) {
  throw new Error('VIDEO_ANALYZER_API_URL environment variable is not set');
}

export const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'ja': 'Japanese',
  'ru': 'Russian',
  'it': 'Italian',
  'zh': 'Chinese',
  'tr': 'Turkish',
  'ko': 'Korean',
  'pt': 'Portuguese'
} as const;

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
export type SupportedLanguageType = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ru' | 'it' | 'zh' | 'tr' | 'ko' | 'pt';

export type Video = {
  uuid: string;
  video_url: string;
  original_name: string | null;
  duration_minutes: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  has_subtitles: boolean;
  subtitle_languages: Array<SupportedLanguageType>;
  subtitles: Array<Subtitle>;
  dubbed_video_url: string | null;
  dubbing_id: string | null;
  is_dubbed_audio: boolean;
  burned_video_url: string | null;
  processingMessage?: string;
};

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
  video_uuid: string;
  video_original_name: string | null;
  subtitle_url: string;
  format: string;
  language: SupportedLanguageType;
  created_at: string;
  updated_at: string;
}

export interface SubtitleListResponse {
  message: string;
  count: number;
  subtitles: Subtitle[];
}

export interface SubtitleGenerationResponse {
  message: string;
  video_uuid: string;
  subtitle_uuid: string | null;
  subtitle_url: string | null;
  dubbing_id: string | null;
  dubbed_video_url: string | null;
  language: string;
  status: string;
  duration_minutes: number | null;
  processing_cost: number | null;
  detail: string | null;
  expected_duration_sec: number | null;
}

export interface DubbingStatusResponse {
  message: string;
  video_uuid: string;
  dubbing_id: string;
  language: string;
  status: string;
  duration_minutes: number | null;
  detail: string | null;
  expected_duration_sec: number | null;
}

export interface DubbingResponse {
  message: string;
  video_uuid: string;
  dubbing_id: string;
  dubbed_video_url: string;
  language: string;
  status: string;
  duration_minutes: number | null;
  processing_cost: number | null;
  detail: string | null;
}

export interface BurnSubtitlesResponse {
  message: string;
  video_uuid: string;
  subtitle_uuid: string;
  burned_video_url: string;
  language: string;
  status: string;
  detail: string;
}

// User Types
export interface UserDetails {
  email: string;
  minutes_consumed: number;
  free_minutes_used: number;
  total_cost: number;
  minutes_remaining: number;
  cost_per_minute: number;
  free_minutes_allocation: number;
  created_at: string | null;
  updated_at: string | null;
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

  async generateSubtitles(
    videoUuid: string,
    language: string,
    options?: { enable_dubbing?: boolean }
  ): Promise<SubtitleGenerationResponse> {
    const response = await apiClient.post(
      `/videos/${videoUuid}/generate_subtitles`,
      { enable_dubbing: options?.enable_dubbing || false }
    );
    return response.data;
  },

  async checkDubbingStatus(
    videoUuid: string,
    dubbingId: string
  ): Promise<DubbingStatusResponse> {
    const response = await apiClient.get(
      `/videos/${videoUuid}/dubbing/${dubbingId}/status`
    );
    return response.data;
  },

  async getDubbedVideo(
    videoUuid: string,
    dubbingId: string
  ): Promise<DubbingResponse> {
    const response = await apiClient.get(
      `/videos/${videoUuid}/dubbing/${dubbingId}/video`
    );
    return response.data;
  },

  async getTranscriptForDub(
    videoUuid: string,
    dubbingId: string
  ): Promise<SubtitleGenerationResponse> {
    const response = await apiClient.get(
      `/videos/${videoUuid}/get-transcript-for-dub/${dubbingId}`
    );
    return response.data;
  },

  async burnSubtitles(
    videoUuid: string,
    subtitleUuid: string
  ): Promise<BurnSubtitlesResponse> {
    const response = await apiClient.post(
      `/videos/${videoUuid}/burn_subtitles`,
      { subtitle_uuid: subtitleUuid }
    );
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

export const users = {
  async me(): Promise<UserDetails> {
    const response = await apiClient.get('/users/me');
    return response.data;
  }
};

export default apiClient; 
