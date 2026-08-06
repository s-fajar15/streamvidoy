"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";

interface DownloadFormProps {
  onSubmit?: (url: string) => void;
  isLoading?: boolean;
}

export function DownloadForm({ onSubmit, isLoading }: DownloadFormProps) {
  const [url, setUrl] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch (err) {
      console.error("Gagal menempelkan teks dari clipboard:", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit?.(url);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-sm">
      <div className="relative flex items-center flex-1">
        <input
          type="url"
          placeholder="Masukkan URL vdy (contoh: https://vdy.to/d/...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={isLoading}
          className="w-full bg-white text-[#0a0a0a] placeholder:text-[#888888] font-sans text-[15px] sm:text-[16px] rounded-xl pl-md pr-12 py-sm border border-[#e5e5e5] focus:outline-none focus:border-[#00d4a4] transition-all h-[48px] disabled:opacity-50"
        />
        <Button
          type="button"
          variant="ghost"
          className="absolute right-2 text-[#5a5a5c] hover:text-[#0a0a0a]"
          onClick={handlePaste}
          disabled={isLoading}
        >
          <Clipboard className="w-4 h-4" />
        </Button>
      </div>

      <Button
        type="submit"
        variant="accent"
        disabled={isLoading}
        className="h-[48px] px-[28px] font-bold text-[14px] whitespace-nowrap"
      >
        {isLoading ? "Mengekstrak..." : "Ekstrak Stream"}
      </Button>
    </form>
  );
}
