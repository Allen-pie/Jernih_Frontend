// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Maaf, halaman yang anda cari tidak ditemukan.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-primary px-5 py-2 text-white hover:bg-primary/90"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
