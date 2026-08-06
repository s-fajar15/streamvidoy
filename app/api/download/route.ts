import { NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import fs from "fs";
import { downloadVideo } from "../../../utils/download";
import { saveHistory } from "../../../lib/history";

const downloadSchema = z.object({
  urlCdn: z.string().url(),
  videoId: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/),
  title: z.string().nullable(),
  poster: z.string().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = downloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data input tidak valid" },
        { status: 400 }
      );
    }

    const { urlCdn, videoId, title, poster } = parsed.data;
    const downloadDir = path.join(process.cwd(), "downloads");
    const output = path.join(downloadDir, `${videoId}.mp4`);

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: Record<string, unknown>) => {
          controller.enqueue(
            new TextEncoder().encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
            )
          );
        };

        const onProgress = (downloaded: number, total: number) => {
          sendEvent("progress", { downloaded, total });
        };

        try {
          const success = await downloadVideo(urlCdn, output, onProgress);
          if (success) {
            let fileSize = 0;
            if (fs.existsSync(output)) {
              fileSize = fs.statSync(output).size;
            }

            saveHistory({
              videoId,
              title,
              poster,
              timestamp: new Date().toISOString(),
              fileSize,
            });
            sendEvent("complete", { videoId });
          } else {
            sendEvent("error", { message: "Gagal mengunduh video" });
          }
        } catch {
          sendEvent("error", { message: "Terjadi kesalahan sistem" });
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
