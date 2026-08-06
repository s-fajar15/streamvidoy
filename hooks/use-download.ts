import { useState, useCallback } from "react";
import { ProgressData, CompleteData, ErrorData } from "../types/api";

export type DownloadStatus = "idle" | "downloading" | "completed" | "error";

export function useDownload() {
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [eta, setEta] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadedFileId, setDownloadedFileId] = useState<string | null>(null);
  const [downloadedSize, setDownloadedSize] = useState<number>(0);
  const [totalSize, setTotalSize] = useState<number>(0);

  const startDownload = useCallback(
    async (
      urlCdn: string,
      videoId: string,
      title: string | null,
      poster: string | null
    ) => {
      setStatus("downloading");
      setProgress(0);
      setSpeed(0);
      setEta(0);
      setError(null);
      setDownloadedFileId(null);
      setDownloadedSize(0);
      setTotalSize(0);

      let lastDownloaded = 0;
      let lastTime = Date.now();

      try {
        const response = await fetch("/api/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ urlCdn, videoId, title, poster }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Gagal memulai unduhan");
        }

        if (!response.body) {
          throw new Error("Stream data tidak tersedia");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const block of lines) {
            const eventMatch = block.match(/event: (.*)\n/);
            const dataMatch = block.match(/data: (.*)/);

            if (eventMatch && dataMatch) {
              const eventName = eventMatch[1];
              const dataString = dataMatch[1];
              const parsedData = JSON.parse(dataString);

              if (eventName === "progress") {
                const data = parsedData as ProgressData;
                const percentage =
                  data.total > 0 ? (data.downloaded / data.total) * 100 : 0;
                
                setProgress(percentage);
                setDownloadedSize(data.downloaded);
                setTotalSize(data.total);

                const currentTime = Date.now();
                const timeDiff = (currentTime - lastTime) / 1000;
                
                if (timeDiff >= 1) {
                  const downloadedDiff = data.downloaded - lastDownloaded;
                  const currentSpeed = downloadedDiff / timeDiff;
                  setSpeed(currentSpeed);

                  if (currentSpeed > 0 && data.total > 0) {
                    const remainingBytes = data.total - data.downloaded;
                    setEta(remainingBytes / currentSpeed);
                  }

                  lastDownloaded = data.downloaded;
                  lastTime = currentTime;
                }
              } else if (eventName === "complete") {
                const data = parsedData as CompleteData;
                setStatus("completed");
                setProgress(100);
                setDownloadedFileId(data.videoId);
              } else if (eventName === "error") {
                const data = parsedData as ErrorData;
                throw new Error(data.message);
              }
            }
          }
        }
      } catch (err) {
        setStatus("error");
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan sistem"
        );
      }
    },
    []
  );

  const resetDownload = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setSpeed(0);
    setEta(0);
    setError(null);
    setDownloadedFileId(null);
    setDownloadedSize(0);
    setTotalSize(0);
  }, []);

  return {
    status,
    progress,
    speed,
    eta,
    error,
    downloadedFileId,
    downloadedSize,
    totalSize,
    startDownload,
    resetDownload,
  };
}
