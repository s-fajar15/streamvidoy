export interface DownloadHistory {
  id: string;
  videoId: string;
  title: string | null;
  poster: string | null;
  timestamp: string;
  fileSize: number;
}
