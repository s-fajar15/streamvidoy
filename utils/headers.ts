import { USER_AGENT } from "./constants";

export function getUserHeaders(host: string): Record<string, string> {
  return {
    host: host,
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "upgrade-insecure-requests": "1",
    "user-agent": USER_AGENT,
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "sec-fetch-site": "none",
    "sec-fetch-mode": "navigate",
    "sec-fetch-user": "?1",
    "sec-fetch-dest": "document",
    "accept-language": "id-ID,id;q=0.8",
  };
}

export function getMeivaHeaders(url: string): Record<string, string> {
  const hostname = new URL(url).hostname;
  return {
    Host: hostname,
    Connection: "keep-alive",
    "sec-ch-ua-platform": '"Android"',
    "Accept-Encoding": "identity;q=1, *;q=0",
    "User-Agent": USER_AGENT,
    "sec-ch-ua-mobile": "?1",
    Accept: "*/*",
    "Sec-GPC": "1",
    "Accept-Language": "id-ID,id;q=0.8",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Dest": "video",
    "Sec-Fetch-Storage-Access": "none",
    Referer: url,
  };
}
