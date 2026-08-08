import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full h-[56px] bg-background text-foreground flex items-center justify-between px-4 md:px-8 border-b border-border">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-sans font-[700] text-[20px] tracking-[-0.14px]">
          Stream
        </Link>
      </div>
      <nav className="flex items-center gap-2">
        <Button variant="secondary" asChild className="hidden md:inline-flex">
          <Link href="#history">Riwayat</Link>
        </Button>
        <Button variant="primary" asChild>
          <Link href="/">Download Sekarang</Link>
        </Button>
      </nav>
    </header>
  )
}