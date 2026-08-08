"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useExtract } from "../../hooks/use-extract";
import { useDownload } from "../../hooks/use-download";
import { useHistory } from "../../hooks/use-history";
import { formatBytes, formatTime } from "../../lib/utils";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpRight,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Clipboard,
} from "lucide-react";

export default function AppPage() {
  return (
    <Suspense fallback={null}>
      <AppPageInner />
    </Suspense>
  );
}

function AppPageInner() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fromQuery = searchParams.get("url");
    if (fromQuery) setUrl(fromQuery);
  }, [searchParams]);

  const {
    mutateAsync: extract,
    data: extractData,
    isPending: isExtracting,
    reset: resetExtract,
  } = useExtract();

  const {
    startDownload,
    status: downloadStatus,
    progress,
    speed,
    eta,
    downloadedSize,
    totalSize,
    resetDownload,
  } = useDownload();

  const { history, clearHistory, isClearing } = useHistory();

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    resetDownload();
    try {
      await extract(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal membaca stream dari URL ini");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
    }
  };

  const handleDownload = async () => {
    if (!extractData?.urlCdn) {
      toast.error("URL sumber tidak ditemukan");
      return;
    }

    try {
      await startDownload(extractData.urlCdn, extractData.idVideo, extractData.title, extractData.poster);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat mengunduh");
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      toast.success("Riwayat dihapus");
    } catch {
      toast.error("Gagal menghapus riwayat");
    }
  };

  const handleReset = () => {
    setUrl("");
    resetExtract();
    resetDownload();
  };

  return (
    <main className="min-h-screen w-full bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-hairline bg-background/95 backdrop-blur">
        <div className="max-w-[900px] mx-auto px-md sm:px-xl h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-xs text-[14px] font-medium text-slate hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Stream
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel">/app</span>
        </div>
      </header>

      <div className="max-w-[900px] mx-auto px-md sm:px-xl py-10 sm:py-14">
        <section aria-labelledby="extract-heading">
          <h1 id="extract-heading" className="font-mono text-[12px] uppercase tracking-[0.14em] text-brand-green mb-xs">
            01 — Masukkan URL
          </h1>
          <p className="text-[15px] text-slate mb-md max-w-[520px] leading-[1.5]">
            Tempel tautan stream yang ingin diproses. Stream akan membaca sumbernya lalu menyiapkan file untuk diunduh.
          </p>

          <form onSubmit={handleExtract} className="flex flex-col sm:flex-row gap-xs">
            <div className="relative flex-1">
              <input
                type="url"
                inputMode="url"
                placeholder="https://streamrizz.com/d/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={isExtracting || downloadStatus === "downloading"}
                className="w-full h-[48px] bg-surface text-foreground placeholder:text-steel font-mono text-[14px] rounded-md pl-md pr-11 border border-hairline focus:outline-none focus:border-brand-green transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handlePaste}
                disabled={isExtracting || downloadStatus === "downloading"}
                aria-label="Tempel dari clipboard"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded flex items-center justify-center text-steel hover:text-foreground hover:bg-hairline-soft transition-colors disabled:opacity-50"
              >
                <Clipboard className="w-4 h-4" />
              </button>
            </div>
            <button
              type="submit"
              disabled={isExtracting || downloadStatus === "downloading" || !url}
              className="h-[48px] px-xl rounded-md bg-brand-green text-[#05100d] font-semibold text-[14px] hover:bg-brand-green-deep transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {isExtracting ? "Membaca…" : "Ekstrak"}
            </button>
          </form>
        </section>

        {extractData && (
          <section aria-labelledby="result-heading" className="mt-xxl pt-xxl border-t border-hairline">
            <h2 id="result-heading" className="font-mono text-[12px] uppercase tracking-[0.14em] text-brand-green mb-md">
              02 — Media Ditemukan
            </h2>

            <div className="flex flex-col sm:flex-row gap-lg">
              <div className="w-full sm:w-[220px] aspect-video bg-surface rounded-md relative overflow-hidden border border-hairline shrink-0">
                {extractData.poster ? (
                  <Image src={extractData.poster} alt="" fill unoptimized className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-steel" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col">
                <h3 className="text-[17px] font-semibold leading-snug mb-xs line-clamp-2">
                  {extractData.title || "Video tanpa judul"}
                </h3>

                <dl className="font-mono text-[12px] text-steel grid grid-cols-[auto_1fr] gap-x-md gap-y-1 mb-md">
                  <dt className="text-steel">id</dt>
                  <dd className="text-slate truncate">{extractData.idVideo}</dd>
                  <dt className="text-steel">host</dt>
                  <dd className="text-slate truncate">{extractData.nameHost}</dd>
                  <dt className="text-steel">output</dt>
                  <dd className="text-slate truncate">mp4</dd>
                </dl>

                {(downloadStatus === "idle" || downloadStatus === "error") && (
                  <div className="mt-auto flex flex-wrap items-center gap-sm">
                    <button
                      onClick={handleDownload}
                      className="h-[42px] px-lg rounded-md bg-foreground text-background font-semibold text-[14px] hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                      Unduh File
                    </button>
                    {downloadStatus === "error" && (
                      <span className="inline-flex items-center gap-xs text-[13px] text-brand-error">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Unduhan gagal, coba lagi.
                      </span>
                    )}
                  </div>
                )}

                {downloadStatus === "downloading" && (
                  <div className="mt-auto bg-surface-code rounded-md p-md border border-hairline font-mono">
                    <div className="flex items-center justify-between text-[12px] mb-2">
                      <span className="text-steel uppercase tracking-[0.1em]">mengunduh</span>
                      <span className="text-brand-green font-semibold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-[3px] bg-hairline-dark rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-brand-green transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-xs text-[11px] text-steel">
                      <div>
                        <div className="uppercase tracking-[0.08em] mb-0.5">ukuran</div>
                        <div className="text-slate">
                          {formatBytes(downloadedSize)} / {formatBytes(totalSize)}
                        </div>
                      </div>
                      <div>
                        <div className="uppercase tracking-[0.08em] mb-0.5">kecepatan</div>
                        <div className="text-slate">{formatBytes(speed)}/s</div>
                      </div>
                      <div>
                        <div className="uppercase tracking-[0.08em] mb-0.5">sisa</div>
                        <div className="text-slate">{formatTime(eta)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {downloadStatus === "completed" && (
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-sm bg-surface rounded-md p-md border border-brand-green/30">
                    <span className="inline-flex items-center gap-xs text-[14px] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                      File siap disimpan
                    </span>
                    <a
                      href={`/api/download/${extractData.idVideo}`}
                      download
                      className="h-[38px] px-md inline-flex items-center rounded-md bg-brand-green text-[#05100d] font-semibold text-[13px] hover:bg-brand-green-deep transition-colors whitespace-nowrap"
                    >
                      Simpan MP4
                    </a>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="mt-lg text-[13px] text-steel hover:text-foreground transition-colors underline underline-offset-4"
            >
              Proses URL lain
            </button>
          </section>
        )}

        <section aria-labelledby="history-heading" className="mt-xxl pt-xxl border-t border-hairline">
          <div className="flex items-center justify-between mb-md">
            <h2 id="history-heading" className="font-mono text-[12px] uppercase tracking-[0.14em] text-brand-green">
              03 — Riwayat
            </h2>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                disabled={isClearing}
                className="inline-flex items-center gap-xs text-[13px] text-steel hover:text-foreground transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus semua
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-[14px] text-steel py-md">Belum ada riwayat di perangkat ini.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-hairline border-y border-hairline">
              {history.map((item) => (
                <li key={item.id} className="py-sm flex items-center gap-md">
                  <div className="w-[52px] aspect-video bg-surface rounded relative overflow-hidden border border-hairline shrink-0">
                    {item.poster ? (
                      <Image src={item.poster} alt="" fill unoptimized className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-medium truncate">{item.title || item.videoId}</div>
                    <div className="font-mono text-[11px] text-steel">
                      {formatBytes(item.fileSize)} · {new Date(item.timestamp).toLocaleDateString("id-ID")}
                    </div>
                  </div>
                  <a
                    href={`/api/download/${item.videoId}`}
                    download
                    className="shrink-0 inline-flex items-center gap-1 text-[13px] text-slate hover:text-brand-green transition-colors"
                  >
                    Unduh
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
