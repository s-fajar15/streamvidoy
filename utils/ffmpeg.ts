import { spawn } from "child_process";
import { USER_AGENT } from "./constants";

export function getVideoDuration(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const headers =
      `User-Agent: ${USER_AGENT}\r\n` +
      `Referer: https://vdy.to/\r\n` +
      `Origin: https://vdy.to\r\n`;

    const args = [
      "-v",
      "error",
      "-headers",
      headers,
      "-user_agent",
      USER_AGENT,
      "-protocol_whitelist",
      "file,http,https,tcp,tls,crypto",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      url,
    ];

    const process = spawn("ffprobe", args);

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        console.error("FFprobe Error:");
        console.error(stderr);
        resolve(null);
        return;
      }

      const duration = parseFloat(stdout.trim());
      resolve(Number.isNaN(duration) ? null : duration);
    });

    process.on("error", (err) => {
      console.error("FFprobe Exception:", err);
      resolve(null);
    });
  });
}