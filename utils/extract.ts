import { STREAM_URL, TITLE_PATTERN, POSTER_PATTERN, SOURCE_PATTERN, VIDEO_ID_PATTERN, STREAM_PATTERN, USER_AGENT } from "./constants";
import { getUserHeaders } from "./headers";
import { DetailVideo } from "../types/downloader";

async function streamDetail(
  videoId: string,
  host: string,
  streamToken: string
): Promise<string | null> {
  try {
    const url = new URL(STREAM_URL);
    url.searchParams.append("bucket", "vidoycdn");
    url.searchParams.append("id", videoId);
    url.searchParams.append("t", streamToken);

    const response = await fetch(url.toString(), {
      headers: {
        Host: host,
        "User-Agent": USER_AGENT,
        Referer: `https://${host}/`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.text();
  } catch {
    return null;
  }
}

export async function extractVideoData(
  url: string
): Promise<DetailVideo | null> {
  try {
    const videoMatch = url.match(VIDEO_ID_PATTERN);
    if (!videoMatch) {
      return null;
    }

    const host = videoMatch[1];
    const videoId = videoMatch[2];

    const response = await fetch(url, {
      headers: getUserHeaders(host),
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    const streamMatch = html.match(STREAM_PATTERN);
    if (!streamMatch) {
      return null;
    }

    const streamToken = streamMatch[1];
    const stream = await streamDetail(videoId, host, streamToken);

    if (!stream) {
      return null;
    }

    const titleMatch = stream.match(TITLE_PATTERN);
    const posterMatch = stream.match(POSTER_PATTERN);
    const sourceMatch = stream.match(SOURCE_PATTERN);

    return {
      idVideo: videoId,
      nameHost: host,
      title: titleMatch ? titleMatch[1].trim() : null,
      poster: posterMatch ? posterMatch[1] : null,
      urlCdn: sourceMatch ? sourceMatch[1] : null,
    };
  } catch {
    return null;
  }
}
