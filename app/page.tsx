// app/page.tsx
"use client";
// import { useEffect, useState } from "react";
import Image from "next/image";
import { useImage } from "@/hooks/use-image";
import { useLogoImage } from "@/hooks/use-logo-image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/context/auth-context";
import { SubscribeForm } from "@/components/subscribe-form";
import Link from "next/link";
import {
  BarChart2,
  Clock,
  Droplet,
  Globe,
  MapPin,
  MessageSquare,
  User,
  Users,
  LogOut,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import { Menu, X } from "lucide-react"; // icon hamburger & close
import { useState } from "react";


const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, when: "beforeChildren" },
  },
};

export default function HomePage() {
  const { signOut, session } = useAuth();
  const heroUrl = useImage("landing-page.jpg");
  const logoUrl = useLogoImage("jernih-logo.svg");
  const childSignUrl = useImage("child_sign.jpg");
  const childWaterUrl = useImage("child_water.png");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // useEffect(() => {
  //   if (session) {
  //     router.push("/dashboard");
  //   }
  // }, [session, router]);

  // if (session) return null; // prevent UI flicker

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full fixed top-0 z-50"
      >
        <div className="container mx-auto px-6 sm:px-10 md:px-16 py-3 flex justify-between items-center">
          {/* Logo */}
          {logoUrl ? (
            <Link href="/">
              <Image
                src={logoUrl}
                width={150}
                height={100}
                alt="Jernih Logo"
                className="cursor-pointer"
              />
            </Link>
          ) : (
            <div className="w-[120px] h-[80px] bg-white/40 animate-pulse rounded" />
          )}

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <SiteNav />
            <div
              className={`ml-auto flex items-center gap-4 ${
                session ? "pr-24" : ""
              }`}
            >
              {session ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div className="grid gap-4">
                      <Button className="justify-start" variant="ghost" onClick={() => signOut()}>
                        <LogOut className="h-4 w-4" />
                        <h4 className="font-medium leading-none">Keluar</h4>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-6 py-4 shadow">
            <SiteNav />
            <div className="mt-4 space-y-2">
              {session ? (
                <Button className="w-full justify-start" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="relative w-full min-h-screen flex items-center justify-start text-left pt-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 1 } }}
          >
            {heroUrl && (
              <Image
                src={heroUrl}
                alt="Clean water background"
                fill
                className="object-cover"
                priority
              />
            )}
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-cyan-900/10 z-10"></div>
        <div className="container mx-auto px-32 relative z-20">
          <div className="max-w-2xl">
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Pantau Kualitas Air Secara Real-Time. Bertindak Sekarang
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg mb-8">
              Bergabunglah dengan ribuan orang yang melindungi perairan kita.
              Laporkan polusi, pantau upaya pembersihan, dan akses data penting.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button className="px-6 py-6">Mulai Sekarang</Button>
                </motion.div>
              </Link>
              <Link href="/login?redirect=/dashboard">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="ghost"
                    className="px-6 py-6 rounded-md hover:bg-cyan-50 hover:text-cyan-600"
                  >
                    Jelajahi Data Kami→
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* The Problem Section */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                {childSignUrl && (
                  <Image
                    src={childSignUrl}
                    alt="Child holding sign about water rights"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                )}
              </div>
              <div className="col-span-2 md:col-span-1 md:mt-12">
                {childWaterUrl && (
                  <Image
                    src={childWaterUrl}
                    alt="Child holding water samples"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                )}
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-cyan-600 mb-6">
                Polusi Air Membunuh Jutaan Jiwa. Saatnya Bertindak.
              </h2>
              <p className="text-gray-700 mb-6 text-lg">
                Setiap tahun, air yang tercemar menyebabkan lebih dari 3,4 juta
                kematian — WHO
              </p>
              <p className="text-gray-600 mb-8">
                Setiap harinya, jutaan orang di seluruh dunia menghadapi dampak
                buruk dari polusi air. Sumber air yang terkontaminasi menjadi
                penyebab utama penyakit, kerusakan ekosistem, dan hilangnya
                keanekaragaman hayati. Anak-anak adalah yang paling rentan —
                ribuan di antaranya meninggal setiap hari akibat penyakit yang
                seharusnya dapat dicegah.
              </p>
              <Link href="#impact">
                <Button>Pelajari Lebih Lanjut</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How You Can Make a Difference */}
      <motion.section
        className="py-20 bg-gray-50 border-t border-b border-gray-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-600 text-center mb-16">
            Bagaimana Kamu Bisa Berkontribusi
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-md border-none">
              <CardContent className="pt-8 px-6 pb-6 text-center">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart2 className="h-10 w-10 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Langkah 1<br />
                  <span className="text-cyan-600">Monitor</span>
                </h3>
                <p className="text-gray-600">
                  Gunakan aplikasi kami untuk memantau kualitas air di sekitarmu
                  dan identifikasi potensi masalah lebih awal.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-none">
              <CardContent className="pt-8 px-6 pb-6 text-center">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-10 w-10 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Langkah 2<br />
                  <span className="text-cyan-600">Report</span>
                </h3>
                <p className="text-gray-600">
                  Laporkan permasalahan lingkungan dan kualitas air melalui
                  platform kami yang mudah digunakan.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-none">
              <CardContent className="pt-8 px-6 pb-6 text-center">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Droplet className="h-10 w-10 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Langkah 3<br />
                  <span className="text-cyan-600">Bertindak</span>
                </h3>
                <p className="text-gray-600">
                  Ikut serta dalam aksi bersih-bersih, advokasi kebijakan, dan
                  kampanye kesadaran publik.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link href="/register">
              <Button className="bg-cyan-500 text-white px-8">
                Bergabung Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Our Mission & Impact */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-cyan-600 mb-4">
                Mendukung Tujuan Pembangunan Berkelanjutan ke-6
              </h2>
              <p className="text-gray-600 mb-8">
                Misi kami sejalan dengan SDG 6: Menjamin ketersediaan dan
                pengelolaan air bersih serta sanitasi yang berkelanjutan untuk
                semua. Kami berkomitmen meningkatkan kualitas air, efisiensi
                penggunaan air, dan melindungi ekosistem terkait air.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-cyan-600">→</div>
                  <p className="text-gray-700">
                    Meningkatkan kualitas air dengan mengurangi pencemaran
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-cyan-600">→</div>
                  <p className="text-gray-700">
                    Meningkatkan efisiensi penggunaan air di semua sektor
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-cyan-600">→</div>
                  <p className="text-gray-700">
                    Melindungi dan memulihkan ekosistem air
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-cyan-600 text-center mb-8">
                Dampak Nyata Kami
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-600">500+</p>
                  <p className="text-gray-600">Sumber Air Dipantau</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-600">10K+</p>
                  <p className="text-gray-600">Anggota Komunitas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-600">200+</p>
                  <p className="text-gray-600">Aksi Bersih-Bersih</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-600">50+</p>
                  <p className="text-gray-600">Organisasi Mitra</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-cyan-600 text-center mb-16">
            Fitur-Fitur Kami
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Droplet className="h-10 w-10 text-cyan-600" />,
                title: "Uji Kualitas Air",
                description:
                  "Akses data real-time tentang parameter kualitas air seperti pH, oksigen terlarut, kekeruhan, dan kontaminan.",
              },
              {
                icon: <MapPin className="h-10 w-10 text-cyan-600" />,
                title: "Pemetaan Interaktif",
                description:
                  "Visualisasikan data kualitas air di berbagai wilayah dan identifikasi titik rawan pencemaran di sekitarmu.",
              },
              {
                icon: <Users className="h-10 w-10 text-cyan-600" />,
                title: "Keterlibatan Komunitas",
                description:
                  "Terhubung dengan relawan lokal, selenggarakan kegiatan bersih-bersih, dan kolaborasi dalam proyek pelestarian air.",
              },
              {
                icon: <BarChart2 className="h-10 w-10 text-cyan-600" />,
                title: "Analisis Data",
                description:
                  "Pantau tren kualitas air dari waktu ke waktu dan ukur dampak dari upaya konservasi yang dilakukan.",
              },
              {
                icon: <Globe className="h-10 w-10 text-cyan-600" />,
                title: "Artikel Edukasi",
                description:
                  "Jelajahi berbagai artikel informatif tentang pencemaran air, konservasi, dan solusi lingkungan terbaru.",
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-cyan-600" />,
                title: "Formulir Laporan",
                description:
                  "Laporkan insiden pencemaran air di lingkungan Anda dengan mudah. Data laporan Anda akan membantu pemantauan dan penanganan lebih cepat.",
              },
            ].map((feature, index) => (
              <Card key={index} className="bg-white shadow-sm border-none">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-cyan-600 text-center mb-16">
            Suara dari Komunitas Kami
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Alat pemantauan air dari JERNIH benar-benar mengubah cara komunitas kami menjaga lingkungan. Kualitas sungai lokal kami kini menunjukkan peningkatan yang nyata.",
                name: "Sarah Johnson",
                role: "Pemimpin Komunitas",
              },
              {
                quote:
                  "Sebagai guru, saya memanfaatkan materi edukasi dari JERNIH untuk menginspirasi murid saya tentang pentingnya konservasi air. Alat interaktifnya membuat belajar jadi lebih menarik.",
                name: "Michael Chen",
                role: "Pendidik Lingkungan",
              },
              {
                quote:
                  "Data dari platform JERNIH membantu kami mendapatkan pendanaan untuk proyek bersih-bersih besar. Dukungan advokasinya sangat membantu keberhasilan kami.",
                name: "Amara Okafor",
                role: "Aktivis Lingkungan",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-cyan-50 shadow-sm border-none">
                <CardContent className="p-6">
                  <p className="italic text-gray-700 mb-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div>
                    <p className="font-bold text-cyan-800">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Subscribe Section */}
      <section className="py-16 bg-cyan-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Bergabunglah dalam Misi Air Bersih
            </h2>
            <p className="mb-8 text-cyan-50">
              Bersama, kita bisa memastikan akses air bersih untuk semua.
              Daftarkan dirimu untuk menerima update, kesempatan menjadi
              relawan, dan berbagai cara untuk berkontribusi di komunitasmu.
            </p>
            <SubscribeForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
