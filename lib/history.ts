import fs from "fs";
import path from "path";
import { DownloadHistory } from "../types/history";

const HISTORY_DIR = path.join(process.cwd(), "history");
const HISTORY_FILE = path.join(HISTORY_DIR, "data.json");

function ensureHistoryFile() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([]), "utf-8");
  }
}

export function getHistory(): DownloadHistory[] {
  try {
    ensureHistoryFile();
    const data = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(data) as DownloadHistory[];
  } catch {
    return [];
  }
}

export function saveHistory(entry: Omit<DownloadHistory, "id">): void {
  try {
    const history = getHistory();
    const newEntry: DownloadHistory = {
      ...entry,
      id: crypto.randomUUID(),
    };
    history.unshift(newEntry);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
  } catch {
  }
}

export function clearHistory(): void {
  try {
    ensureHistoryFile();
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([]), "utf-8");
  } catch {
  }
}
