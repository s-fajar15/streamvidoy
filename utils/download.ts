import fs from "fs";
import { spawn } from "child_process";
import { getMeivaHeaders } from "./headers";
import { CHUNK_SIZE, USER_AGENT } from "./constants";
import { getVideoDuration } from "./ffmpeg";

export async function downloadDirect(
  url: string,
  output: string,
  onProgress?: (downloaded: number, total: number) => void
): Promise<boolean> {
  try {
    const headers = getMeivaHeaders(url);

    const headReq = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const totalSize = parseInt(headReq.headers.get("content-length") || "0", 10);

    if (headReq.body) {
      await headReq.body.cancel();
    }

    if (totalSize === 0) {
      console.log("Ukuran file tidak terdeteksi oleh server CDN.");
      return false;
    }

    let downloadedSize = 0;
    if (fs.existsSync(output)) {
      downloadedSize = fs.statSync(output).size;
    }

    if (downloadedSize >= totalSize) {
      onProgress?.(totalSize, totalSize);
      return true;
    }

    const fileStream = fs.createWriteStream(output, {
      flags: downloadedSize > 0 ? "a" : "w",
    });

    while (downloadedSize < totalSize) {
      const endByte = Math.min(downloadedSize + CHUNK_SIZE - 1, totalSize - 1);
      const chunkHeaders = {
        ...headers,
        Range: `bytes=${downloadedSize}-${endByte}`,
      };

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: chunkHeaders,
          cache: "no-store",
        });

        if (!response.ok && response.status !== 206) {
          console.log(`[Retry] Server merespons dengan status: ${response.status}`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (buffer.length > 0) {
          fileStream.write(buffer);
          downloadedSize += buffer.length;
          onProgress?.(downloadedSize, totalSize);
        }
      } catch (err) {
        console.log(`[Retry] Koneksi terputus:`, err);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    fileStream.end();
    return true;
  } catch (err) {
    console.error("Gagal saat mencoba downloadDirect:", err);
    return false;
  }
}

export async function downloadHls(
  url: string,
  output: string,
  onProgress?: (downloaded: number, total: number) => void
): Promise<boolean> {
  try {
    let duration = await getVideoDuration(url);
    const headers =
      `User-Agent: ${USER_AGENT}\r\n` +
      `Referer: https://vdy.to/\r\n` +
      `Origin: https://vdy.to\r\n`;
    let unknownDuration = false;

    if (duration === null || duration <= 0) {
      duration = 100;
      unknownDuration = true;
    }

    const args = [
      "-y",
      "-headers",
      headers,
      "-user_agent",
      USER_AGENT,
      "-protocol_whitelist",
      "file,http,https,tcp,tls,crypto",
      "-i",
      url,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      "-progress",
      "pipe:1",
      "-nostats",
      output,
    ];

    return new Promise((resolve) => {
      
      const process = spawn("ffmpeg", args);

      process.stdout.on("data", (data) => {
        const lines = data.toString().split("\n");
        for (const line of lines) {
          if (line.startsWith("out_time_ms=")) {
            try {
              const msString = line.split("=")[1];
              const currentTime = parseInt(msString, 10) / 1000000;
              const progressValue = unknownDuration
                ? currentTime % 100
                : Math.min(currentTime, duration as number);
              onProgress?.(
                progressValue,
                unknownDuration ? 100 : (duration as number)
              );
            } catch {
              continue;
            }
          }
        }
      });

      process.on("close", (code) => {
        resolve(code === 0);
      });

      process.on("error", () => {
        resolve(false);
      });
    });
  } catch {
    return false;
  }
}

export async function downloadVideo(
  url: string,
  output: string,
  onProgress?: (downloaded: number, total: number) => void
): Promise<boolean> {
  const lowerUrl = url.toLowerCase();
  if (
    lowerUrl.endsWith(".m3u8") ||
    lowerUrl.includes(".m3u8?") ||
    lowerUrl.includes("overfetch.video")
  ) {
    return downloadHls(url, output, onProgress);
  }
  return downloadDirect(url, output, onProgress);
}
