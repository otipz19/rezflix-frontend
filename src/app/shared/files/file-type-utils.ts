// TODO: check whether max file size should be checked
export const MAX_FILE_SIZE = 1024 * 1024 * 1024;

export const VIDEO_TYPES: readonly string[] = [
  "video/mp4",
] as const;

export const IMAGE_TYPES: readonly string[] = [
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const;

export const VIDEO_ICON_SRC = 'video-icon.png';
