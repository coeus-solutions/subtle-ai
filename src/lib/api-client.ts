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

export type ProcessingType = 'subtitles' | 'dubbing' | 'voiceover';

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
  processed_video_url: string | null;
  dubbing_id: string | null;
  is_dubbed_audio: boolean;
  burned_video_url: string | null;
  processingMessage?: string;
  processing_type?: ProcessingType;
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
  subtitleStyle?: SubtitleStyle;
  processing_type?: ProcessingType;
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

export interface VideoShareResponse {
  message: string;
  video_uuid: string;
  share_uuid: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  video_url: string;
  original_name: string | null;
  duration_minutes: number;
  status: string;
  processed_video_url: string | null;
  burned_video_url: string | null;
  is_dubbed_audio: boolean;
  processing_type: ProcessingType;
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
  processed_video_url: string;
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

export interface SubtitleStyle {
  fontSize: 'small' | 'medium' | 'large';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  position: 'bottom' | 'top';
  alignment: 'left' | 'center' | 'right';
}

export interface SubtitleStyleResponse {
  message: string;
  video_uuid: string;
  style: SubtitleStyle;
}

export interface SharedVideoResponse {
  message: string;
  video_uuid: string;
  share_uuid: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  video_url: string;
  original_name: string | null;
  duration_minutes: number;
  status: string;
  processed_video_url: string | null;
  burned_video_url: string | null;
  is_dubbed_audio: boolean;
  processing_type: ProcessingType;
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

  async upload({ file, language, subtitleStyle, processing_type }: VideoUploadRequest): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    if (subtitleStyle) {
      formData.append('subtitle_styles', JSON.stringify(subtitleStyle));
    }
    if (processing_type) {
      formData.append('processing_type', processing_type);
    }

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
    options?: { 
      subtitleStyle?: SubtitleStyle;
      processing_type?: ProcessingType;
      description?: string;
      speed?: number;
      voice_gender?: 'male' | 'female';
    }
  ): Promise<SubtitleGenerationResponse> {
    // Extract only description and speed for voiceover
    const payload: any = {};
    
    // Add description and speed if they exist in options
    if (options?.description !== undefined && options.description !== "") {
      payload.description = options.description;
    }
    
    if (options?.speed !== undefined) {
      payload.speed = options.speed;
    }
    
    if (options?.voice_gender !== undefined) {
      payload.voice_gender = options.voice_gender;
    }
    
    const response = await apiClient.post(
      `/videos/${videoUuid}/generate_subtitles`,
      payload
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

  async saveSubtitleStyle(
    videoUuid: string, 
    style: SubtitleStyle
  ): Promise<SubtitleStyleResponse> {
    const response = await apiClient.post(
      `/videos/${videoUuid}/subtitle-style`,
      { style }
    );
    return response.data;
  },

  async share(videoUuid: string): Promise<VideoShareResponse> {
    const response = await apiClient.post(`/videos/${videoUuid}/share`);
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

export const shared = {
  async watch(shareUuid: string): Promise<SharedVideoResponse> {
    const response = await apiClient.get(`/shared/watch/${shareUuid}`);
    return response.data;
  }
};

export default apiClient; 
