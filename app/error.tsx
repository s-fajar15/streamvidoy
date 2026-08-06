"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center min-h-screen p-lg bg-background">
      <div className="bg-muted text-ink rounded-lg p-xxl max-w-[600px] w-full text-center flex flex-col items-center border border-border">
        <AlertCircle className="w-12 h-12 text-accent-magenta mb-md" />
        <h2 className="font-sans text-[26px] font-medium leading-[1.35] tracking-[-0.26px] mb-sm">
          Terjadi Kesalahan Sistem
        </h2>
        <p className="font-sans text-[18px] font-light opacity-80 mb-lg">
          {error.message || "Aplikasi mengalami kegagalan saat memuat halaman."}
        </p>
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground font-sans text-[20px] font-medium rounded-pill px-[24px] py-[10px]"
        >
          Coba Lagi
        </button>
      </div>
    </main>
  );
}
