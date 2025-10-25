export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface VoiceNote {
  id: string;
  user_id: string;
  title: string;
  audio_url: string;
  hash: string;
  created_at: string;
}