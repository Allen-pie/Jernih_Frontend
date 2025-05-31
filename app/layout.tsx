import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/context/auth-context";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jernih",
  description: "Software Engineering Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* screen size indicator */}
           <div className="fixed bottom-2 right-2 z-[9999] text-white text-xs font-mono">
            <div className="block sm:hidden bg-red-600 px-2 py-1 rounded">xs</div>
            <div className="hidden sm:block md:hidden bg-yellow-600 px-2 py-1 rounded">sm</div>
            <div className="hidden md:block lg:hidden bg-green-600 px-2 py-1 rounded">md</div>
            <div className="hidden lg:block xl:hidden bg-blue-600 px-2 py-1 rounded">lg</div>
            <div className="hidden xl:block 2xl:hidden bg-purple-600 px-2 py-1 rounded">xl</div>
            <div className="hidden 2xl:block bg-pink-600 px-2 py-1 rounded">2xl</div>
          </div>
          <ClientLayout>
            {children}
            </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
