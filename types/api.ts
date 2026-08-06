import { DetailVideo } from "./downloader";
import { DownloadHistory } from "./history";

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export interface ExtractResponse extends DetailVideo {}

export type HistoryResponse = DownloadHistory[];

export interface ProgressData {
  downloaded: number;
  total: number;
}

export interface CompleteData {
  videoId: string;
}

export interface ErrorData {
  message: string;
}
