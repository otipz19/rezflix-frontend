export interface WatchRoomStateDto {
  paused: boolean;
  episodePositionMs: number;
}

export interface WatchRoomDto {
  hostUserId: number;
  episodeId: string;
  hlsLink: string;
  isPaused: boolean;
  episodePositionMs: number;
}

export interface ChatMessageDto {
  username: string | null;
  message: string;
}