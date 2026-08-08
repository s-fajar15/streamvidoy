import { NextResponse } from "next/server";
import { z } from "zod";
import { extractVideoData } from "../../../utils/extract";

const extractSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = extractSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "URL tidak valid" },
        { status: 400, headers: { "X-Content-Type-Options": "nosniff" } }
      );
    }

    const { url } = parsed.data;
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes("streamrizz.com")) {
      return NextResponse.json(
        { error: "Domain tidak didukung. Harap gunakan URL dari vdy.to" },
        { status: 400 }
      );
    }

    const data = await extractVideoData(url);

    if (!data) {
      return NextResponse.json(
        { error: "Gagal mengambil detail video" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
