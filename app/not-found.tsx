import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-screen p-lg bg-background">
      <div className="bg-block-cream text-ink rounded-lg p-xxl max-w-[600px] w-full text-center flex flex-col items-center">
        <h2 className="font-sans text-[86px] font-light leading-[1] tracking-[-1.72px] mb-md">
          404
        </h2>
        <p className="font-sans text-[26px] font-light leading-[1.35] tracking-[-0.26px] mb-lg">
          Halaman tidak ditemukan.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground font-sans text-[20px] font-medium rounded-pill px-[24px] py-[10px]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
