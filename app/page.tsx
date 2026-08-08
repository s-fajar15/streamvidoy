"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const STAGES = [
  { k: "url", label: "URL" },
  { k: "stream", label: "Stream" },
  { k: "media", label: "Media" },
  { k: "file", label: "File" },
];

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = url.trim() ? `?url=${encodeURIComponent(url.trim())}` : "";
    router.push(`/app${q}`);
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground font-sans">
      <header className="border-b border-hairline">
        <div className="max-w-[760px] mx-auto px-md sm:px-xl h-[56px] flex items-center justify-between">
          <span className="font-mono text-[13px] font-semibold tracking-tight text-foreground">
            stream<span className="text-brand-green">.</span>
          </span>
          <Link
            href="/app"
            className="font-mono text-[12px] uppercase tracking-[0.1em] text-steel hover:text-foreground transition-colors"
          >
            Buka /app →
          </Link>
        </div>
      </header>

      <section className="max-w-[760px] mx-auto px-md sm:px-xl pt-14 sm:pt-20 pb-10">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-brand-green mb-md">
          Stream Downloader
        </p>
        <h1 className="text-[30px] sm:text-[42px] font-semibold leading-[1.15] tracking-tight max-w-[560px] mb-md">
          Ekstrak video dari tautan stream, lalu unduh sebagai file.
        </h1>
        <p className="text-[15px] sm:text-[16px] text-slate leading-[1.6] max-w-[480px]">
          Stream membaca halaman player, menemukan sumber videonya, dan
          menyiapkannya sebagai satu file MP4 yang bisa disimpan langsung ke perangkat.
        </p>
      </section>

      <section className="max-w-[760px] mx-auto px-md sm:px-xl pb-16">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-xs">
          <input
            type="url"
            inputMode="url"
            placeholder="https://streamrizz.com/d/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-[52px] bg-surface text-foreground placeholder:text-steel font-mono text-[14px] rounded-md px-md border border-hairline focus:outline-none focus:border-brand-green transition-colors"
          />
          <button
            type="submit"
            className="h-[52px] px-xl rounded-md bg-brand-green text-[#05100d] font-semibold text-[14px] hover:bg-brand-green-deep transition-colors inline-flex items-center justify-center gap-xs whitespace-nowrap"
          >
            Mulai
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-xs text-[12px] text-steel font-mono">
          Tempel URL di sini lalu tekan Mulai untuk melanjutkan proses ekstraksi.
        </p>
      </section>

      <section className="border-y border-hairline bg-surface-soft">
        <div className="max-w-[760px] mx-auto px-md sm:px-xl py-12">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-steel mb-lg">
            Cara Kerja
          </p>
          <div className="flex flex-col sm:flex-row sm:items-stretch gap-0">
            {STAGES.map((stage, i) => (
              <div key={stage.k} className="flex-1 flex sm:flex-col items-center sm:items-start gap-md sm:gap-0">
                <div className="flex sm:hidden items-center gap-xs w-full">
                  <span className="font-mono text-[13px] text-steel w-6">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] font-semibold">{stage.label}</span>
                </div>
                <div className="hidden sm:block font-mono text-[12px] text-steel mb-xs">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="hidden sm:block text-[17px] font-semibold mb-xs">{stage.label}</div>
                <p className="hidden sm:block text-[13px] text-slate leading-[1.5] pr-md">
                  {stageDescription(stage.k)}
                </p>
                {i < STAGES.length - 1 && (
                  <div className="hidden sm:flex items-center justify-center w-8 text-steel shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[760px] mx-auto px-md sm:px-xl py-14">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-brand-green mb-lg">
          Yang Didukung
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-lg gap-x-md">
          <div>
            <div className="font-mono text-[11px] text-steel uppercase tracking-[0.08em] mb-1">Sumber</div>
            <div className="text-[14px] text-foreground">streamrizz.com</div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-steel uppercase tracking-[0.08em] mb-1">Output</div>
            <div className="text-[14px] text-foreground">MP4</div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-steel uppercase tracking-[0.08em] mb-1">Metadata</div>
            <div className="text-[14px] text-foreground">Judul, poster, ID, host</div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-steel uppercase tracking-[0.08em] mb-1">Riwayat</div>
            <div className="text-[14px] text-foreground">Tersimpan di perangkat</div>
          </div>
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="max-w-[760px] mx-auto px-md sm:px-xl py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
          <div>
            <h2 className="text-[20px] font-semibold mb-1">Siap coba?</h2>
            <p className="text-[14px] text-slate">Masuk ke /app dan tempel URL stream kamu.</p>
          </div>
          <Link
            href="/app"
            className="h-[46px] px-xl rounded-md bg-foreground text-background font-semibold text-[14px] hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-xs whitespace-nowrap shrink-0"
          >
            Buka Stream
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="max-w-[760px] mx-auto px-md sm:px-xl py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-xs">
          <span className="font-mono text-[12px] text-steel">stream / downloader</span>
          <span className="font-mono text-[12px] text-steel">url → stream → media → file</span>
        </div>
      </footer>
    </main>
  );
}

function stageDescription(key: string) {
  switch (key) {
    case "url":
      return "Tempel tautan halaman stream yang ingin diunduh.";
    case "stream":
      return "Stream membaca halaman dan menemukan sumber video di baliknya.";
    case "media":
      return "Judul, poster, dan ID video ditampilkan sebelum diunduh.";
    case "file":
      return "Unduh sebagai satu file MP4 ke perangkatmu.";
    default:
      return "";
  }
}
