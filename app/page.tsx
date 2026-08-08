"use client";

import { useState } from "react";
import { useExtract } from "../hooks/use-extract";
import { useDownload } from "../hooks/use-download";
import { useHistory } from "../hooks/use-history";
import { formatBytes, formatTime } from "../lib/utils";
import { toast } from "sonner";
import { Download, Trash2, Image as ImageIcon,CheckCircle2, AlertCircle, Terminal, Sparkles,ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const [url, setUrl] = useState("");
  
  const { 
    mutateAsync: extract, 
    data: extractData, 
    isPending: isExtracting 
  } = useExtract();
  
  const {
    startDownload,
    status: downloadStatus,
    progress,
    speed,
    eta,
    downloadedSize,
    totalSize,
    resetDownload
  } = useDownload();
  
  const { 
    history, 
    clearHistory, 
    isClearing 
  } = useHistory();

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    resetDownload();
    try {
      await extract(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengambil data video");
    }
  };

  const handleDownload = async () => {
    if (!extractData?.urlCdn) {
      toast.error("URL CDN tidak ditemukan");
      return;
    }
    
    try {
      await startDownload(
        extractData.urlCdn,
        extractData.idVideo,
        extractData.title,
        extractData.poster
      );
      toast.success("Video berhasil diDownload");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat mengDownload");
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      toast.success("Riwayat berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus riwayat");
    }
  };

  return (
    <main className="flex-1 w-full min-h-screen bg-white text-[#0a0a0a] flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="h-[64px] bg-white border-b border-[#e5e5e5] sticky top-0 z-50 px-md sm:px-xl flex items-center justify-between">
        <div className="flex items-center gap-xs font-sans text-[16px] sm:text-[18px] font-bold tracking-tight whitespace-nowrap text-[#0a0a0a]">
          <div className="w-6 h-6 rounded-md bg-[#00d4a4] flex items-center justify-center text-[#0a0a0a] font-mono text-[12px] font-bold shrink-0">
            V
          </div>
          <span>Stream Downloader</span>
          <span className="text-[#5a5a5c] font-normal text-[12px] sm:text-[14px] hidden xs:inline ml-1">Docs Downloader</span>
        </div>

        <div className="flex items-center gap-xs sm:gap-sm shrink-0">
          <a href="#riwayat" className="font-sans text-[13px] sm:text-[14px] font-medium text-[#5a5a5c] hover:text-[#0a0a0a] transition-colors px-xs sm:px-md py-xs whitespace-nowrap">
            Riwayat
          </a>
          <a href="#extractor" className="bg-[#00d4a4] text-[#0a0a0a] font-sans text-[13px] sm:text-[14px] font-semibold rounded-full px-md sm:px-[20px] py-[8px] hover:bg-[#00b48a] transition-colors inline-flex items-center gap-xs whitespace-nowrap shadow-sm">
            Mulai Download
          </a>
        </div>
      </nav>

      <header className="bg-gradient-to-b from-[#87a8c8]/20 via-[#f5e9d8]/30 to-white text-[#0a0a0a] py-12 sm:py-16 px-xl flex flex-col items-center text-center relative overflow-hidden border-b border-[#e5e5e5]">
        
        <h1 className="font-sans text-[32px] sm:text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-tight max-w-[900px] mb-md text-[#0a0a0a]">
          Download Video Tanpa Batas
        </h1>

        <p className="font-sans text-[15px] sm:text-[18px] font-normal leading-[1.5] max-w-[640px] text-[#3a3a3c] mb-8">
          Mendukung analisis dan ekstraksi sumber HLS, MP4, dan CDN untuk proses Download yang lebih fleksibel.
        </p>
        <a 
          href="#extractor" 
          className="bg-[#0a0a0a] text-white font-sans text-[14px] font-semibold rounded-full px-[28px] py-[14px] hover:bg-[#1c1c1e] transition-all inline-flex items-center gap-2 shadow-md whitespace-nowrap"
        >
          <span>Coba Sekarang</span>
          <ArrowRight className="w-4 h-4 text-[#00d4a4]" />
        </a>
      </header>
      
      <section id="extractor" className="max-w-[1000px] w-full mx-auto px-md sm:px-xl py-12">
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-md sm:p-8 shadow-sm">
          <div className="flex items-center gap-xs mb-md">
            <Terminal className="w-5 h-5 text-[#00b48a]" />
            <h2 className="font-sans text-[20px] sm:text-[22px] font-bold text-[#0a0a0a]">
              Input Video Stream
            </h2>
          </div>

          <form onSubmit={handleExtract} className="flex flex-col sm:flex-row gap-sm mb-lg">
            <input
              type="url"
              placeholder="Masukkan Url (contoh: https://streamrizz.com/d/...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isExtracting || downloadStatus === "downloading"}
              className="flex-1 bg-white text-[#0a0a0a] placeholder:text-[#888888] font-sans text-[15px] sm:text-[16px] rounded-xl px-md py-sm border border-[#e5e5e5] focus:outline-none focus:border-[#00d4a4] transition-all h-[48px] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isExtracting || downloadStatus === "downloading"}
              className="bg-[#00d4a4] text-[#0a0a0a] font-sans text-[14px] font-bold rounded-xl px-[28px] h-[48px] hover:bg-[#00b48a] transition-all disabled:opacity-50 whitespace-nowrap inline-flex items-center justify-center gap-xs shadow-sm"
            >
              {isExtracting ? "Mengekstrak..." : "Ekstrak Stream"}
            </button>
          </form>
          {extractData && (
            <div className="bg-[#f7f7f7] rounded-2xl border border-[#e5e5e5] p-md sm:p-6 mt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[280px] aspect-video bg-[#1c1c1e] rounded-xl relative overflow-hidden flex items-center justify-center border border-[#e5e5e5] shrink-0">
                  {extractData.poster ? (
                    <Image 
                      src={extractData.poster} 
                      alt="Thumbnail" 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#888888]" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans text-[18px] sm:text-[20px] font-bold text-[#0a0a0a] leading-[1.3] mb-xs">
                      {extractData.title || "Video Tanpa Judul"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-xs mt-xs mb-md">
                      <span className="bg-[#1c1c1e] text-white font-mono text-[12px] font-semibold px-sm py-xs rounded-md border border-[#1c1c1e]">
                        ID: {extractData.idVideo}
                      </span>
                      <span className="bg-white text-[#0a0a0a] font-mono text-[12px] font-semibold px-sm py-xs rounded-md border border-[#e5e5e5]">
                        HOST: {extractData.nameHost}
                      </span>
                    </div>
                  </div>

        
                  {downloadStatus === "idle" || downloadStatus === "error" ? (
                    <button
                      onClick={handleDownload}
                      className="bg-[#0a0a0a] text-white font-sans text-[14px] font-bold rounded-full px-[24px] py-[12px] hover:bg-[#1c1c1e] transition-all inline-flex items-center gap-2 self-start whitespace-nowrap shadow-md mt-2"
                    >
                      <Download className="w-4 h-4 text-[#00d4a4]" />
                      <span>Download Sekarang</span>
                    </button>
                  ) : null}

                  
                  {downloadStatus === "downloading" && (
                    <div className="bg-[#1c1c1e] text-white rounded-xl p-5 border border-[#1f1f1f] font-mono shadow-md mt-2">
                      <div className="flex items-center justify-between text-[13px] mb-2">
                        <span className="font-semibold text-white">MENGDownload STREAM</span>
                        <span className="text-[#00d4a4] font-bold">{progress.toFixed(1)}%</span>
                      </div>

                     
                      <div className="w-full bg-[#3a3a3c] h-2.5 rounded-full overflow-hidden mb-4">
                        <div 
                          className="bg-[#00d4a4] h-full transition-all duration-300 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-xs text-[12px] pt-3 border-t border-[#3a3a3c]">
                        <div>
                          <span className="block text-[#a8a8aa] text-[11px] font-sans font-medium">UKURAN</span>
                          <span className="text-white font-sans font-bold text-[13px]">{formatBytes(downloadedSize)} / {formatBytes(totalSize)}</span>
                        </div>
                        <div>
                          <span className="block text-[#a8a8aa] text-[11px] font-sans font-medium">KECEPATAN</span>
                          <span className="text-white font-sans font-bold text-[13px]">{formatBytes(speed)}/s</span>
                        </div>
                        <div>
                          <span className="block text-[#a8a8aa] text-[11px] font-sans font-medium">SISA WAKTU</span>
                          <span className="text-white font-sans font-bold text-[13px]">{formatTime(eta)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {downloadStatus === "completed" && (
                    <div className="bg-[#00d4a4]/10 text-[#0a0a0a] rounded-xl p-md border border-[#00d4a4]/40 flex items-center justify-between gap-md mt-2">
                      <div className="flex items-center gap-xs font-sans text-[14px] font-bold text-[#0a0a0a]">
                        <CheckCircle2 className="w-5 h-5 text-[#00b48a]" />
                        Downloadan Berhasil Diselesaikan
                      </div>
                      <a 
                        href={`/api/download/${extractData.idVideo}`}
                        className="bg-[#00d4a4] text-[#0a0a0a] font-sans text-[13px] font-bold rounded-full px-md py-xs hover:bg-[#00b48a] transition-colors whitespace-nowrap shadow-sm"
                        download
                      >
                        Simpan File MP4
                      </a>
                    </div>
                  )}

                  {downloadStatus === "error" && (
                    <div className="bg-[#d45656]/10 text-[#d45656] rounded-xl p-md border border-[#d45656]/20 flex items-center gap-xs font-sans text-[14px] font-bold mt-2">
                      <AlertCircle className="w-5 h-5 shrink-0 text-[#d45656]" />
                      Gagal mengDownload video. Silakan periksa koneksi atau coba kembali.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="riwayat" className="max-w-[1000px] w-full mx-auto px-md sm:px-xl pb-16">
        <div className="border-t border-[#e5e5e5] pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-sans text-[22px] font-bold text-[#0a0a0a]">
                Riwayat Sesi
              </h2>
              <p className="font-sans text-[14px] text-[#5a5a5c]">Daftar video yang telah Anda proses di perangkat ini.</p>
            </div>

            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                disabled={isClearing}
                className="bg-white text-[#0a0a0a] hover:bg-[#f7f7f7] font-sans text-[14px] font-semibold border border-[#e5e5e5] rounded-full px-md py-xs inline-flex items-center gap-xs transition-colors whitespace-nowrap shadow-sm"
              >
                <Trash2 className="w-4 h-4 text-[#5a5a5c]" />
                Hapus Riwayat
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="bg-[#f7f7f7] rounded-2xl border border-[#e5e5e5] p-8 text-center text-[#5a5a5c] font-sans text-[14px] font-medium">
              Belum ada riwayat Downloadan dalam sesi ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {history.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-[#e5e5e5] p-md flex gap-md items-center justify-between hover:border-[#00d4a4] transition-colors shadow-sm">
                  <div className="flex items-center gap-md min-w-0">
                    <div className="w-[60px] aspect-video bg-[#f7f7f7] rounded-lg relative overflow-hidden border border-[#e5e5e5] shrink-0">
                      {item.poster ? (
                        <Image src={item.poster} alt="" fill className="object-cover" unoptimized />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-[#888888] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-sans text-[14px] font-bold text-[#0a0a0a] truncate">
                        {item.title || item.videoId}
                      </h4>
                      <div className="flex items-center gap-xs font-mono text-[12px] text-[#5a5a5c] mt-0.5">
                        <span>{formatBytes(item.fileSize)}</span>
                        <span>•</span>
                        <span>{new Date(item.timestamp).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`/api/download/${item.videoId}`}
                    className="bg-[#f7f7f7] text-[#0a0a0a] font-sans text-[13px] font-bold rounded-full px-md py-xs border border-[#e5e5e5] hover:bg-[#e5e5e5] transition-colors shrink-0 whitespace-nowrap"
                    download
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      
      <footer className="mt-auto bg-[#0a0a0a] text-white border-t border-[#1f1f1f] py-10 px-xxl font-sans text-[14px]">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div className="flex items-center gap-xs font-bold text-white">
            <div className="w-5 h-5 rounded bg-[#00d4a4] text-[#0a0a0a] font-mono text-[10px] font-bold flex items-center justify-center">V</div>
            Stream Downloader
          </div>
        </div>
      </footer>
    </main>
  );
}
