import * as React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-background text-foreground py-[96px] px-[32px] border-t border-border mt-auto">
      <div className="container mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-sans font-[700] text-[24px]">Stream</h2>
            <p className="font-sans font-[330] text-[16px] mt-4 max-w-sm text-muted-foreground">
              Alat ekstraksi dan unduh video dari tautan stream, langsung dari browser.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-[12px] uppercase tracking-[0.60px]">Aplikasi</h3>
              <Link href="/" className="font-sans text-[16px] font-[330] hover:underline">Beranda</Link>
              <Link href="#history" className="font-sans text-[16px] font-[330] hover:underline">Riwayat</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-[12px] uppercase tracking-[0.60px]">Legal</h3>
              <Link href="#" className="font-sans text-[16px] font-[330] hover:underline">Privasi</Link>
              <Link href="#" className="font-sans text-[16px] font-[330] hover:underline">Ketentuan</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}