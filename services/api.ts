import { ExtractResponse, HistoryResponse } from "../types/api";

export async function extractVideo(url: string): Promise<ExtractResponse> {
  const response = await fetch("/api/extract", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal mengekstrak video");
  }

  return response.json();
}

export async function fetchHistory(): Promise<HistoryResponse> {
  const response = await fetch("/api/history", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil riwayat");
  }

  return response.json();
}

export async function clearHistory(): Promise<void> {
  const response = await fetch("/api/history", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus riwayat");
  }
}
