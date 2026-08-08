export const STREAM_URL = "https://streamrizz.com/stream.php";
export const USER_AGENT =
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36";
export const CHUNK_SIZE = 1024 * 1024;
export const TITLE_PATTERN = /<title>(.*?)<\/title>/is;
export const POSTER_PATTERN = /poster=["']([^"']+)["']/i;
export const SOURCE_PATTERN = /<source\s+src=["']([^"']+)["']/i;
export const VIDEO_ID_PATTERN = /https?:\/\/([^/]+)\/[ed]\/([a-zA-Z0-9_-]+)/;
export const STREAM_PATTERN = /embedToken\s*=\s*['"]([^'"]+)['"]/;
