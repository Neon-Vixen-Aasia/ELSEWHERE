export type EnvironmentId = 
  | 'quiet-room' 
  | 'infinite-garden' 
  | 'floating-shore' 
  | 'cloud-observatory' 
  | 'night-window';

export interface EnvironmentInfo {
  id: EnvironmentId;
  name: string;
  subtitle: string;
  era: string;
  imagePath: string;
  palette: {
    ambient: string;
    accent: string;
    tint: string;
  };
}

export interface Oddity {
  id: string;
  environmentId: EnvironmentId;
  title: string;
  description: string;
  discoveredAt?: number;
}

export interface WhisperData {
  text: string;
  source?: string;
}

export interface AppSettings {
  audioEnabled: boolean;
  volume: number;
  reducedMotion: boolean;
}
