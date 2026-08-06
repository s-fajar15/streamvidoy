export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9-_\.]/g, "_")
    .replace(/_{2,}/g, "_")
    .trim();
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}
