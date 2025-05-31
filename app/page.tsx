// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useImage } from "@/hooks/use-image";
import { useLogoImage } from "@/hooks/use-logo-image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/context/auth-context";
import { SubscribeForm } from "@/components/subscribe-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const heroUrl = useImage("landing-page.jpg");
  const logoUrl = useLogoImage("jernih-logo.svg");
  const childSignUrl = useImage("child_sign.jpg");
  const childWaterUrl = useImage("child_water.png");

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
        <div className="container mx-auto px-8 sm:px-16 md:px-28 lg:px-32 py-3 flex justify-between items-center">
          {logoUrl ? (
            <Image src={logoUrl} width={150} height={100} alt="Jernih Logo" />
          ) : (
            <div className="w-[150px] h-[100px] bg-white/40 animate-pulse rounded" />
          )}
          <div className="hidden md:flex items-center space-x-6">
            <SiteNav />
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
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
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Monitor Water Quality in Real-Time. Take Action Today
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg mb-8">
              Join thousands protecting our waters. Report pollution, track
              clean-up efforts, and access vital data.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button className="px-6 py-6">Get Started</Button>
                </motion.div>
              </Link>
              <Link href="/login?redirect=/dashboard">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="ghost"
                    className="px-6 py-6 rounded-md hover:bg-cyan-50 hover:text-cyan-600"
                  >
                    Explore Our Data→
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
                Water Pollution Is Killing Millions. Act Now.
              </h2>
              <p className="text-gray-700 mb-6 text-lg">
                Unsafe water causes 3.4 million deaths annually — World Health
                Organization
              </p>
              <p className="text-gray-600 mb-8">
                Every day, millions of people worldwide face the devastating
                consequences of water pollution. Contaminated water sources lead
                to disease, ecosystem destruction, and loss of biodiversity.
                Children are especially vulnerable, with thousands dying daily
                from preventable water-related illnesses.
              </p>
              <Link href="#impact">
                <Button>Learn more</Button>
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
            How You Can Make a Difference
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-md border-none">
              <CardContent className="pt-8 px-6 pb-6 text-center">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart2 className="h-10 w-10 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Step 1<br />
                  <span className="text-cyan-600">Monitor</span>
                </h3>
                <p className="text-gray-600">
                  Use our app to check water quality in your local area and
                  identify potential issues.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-none">
              <CardContent className="pt-8 px-6 pb-6 text-center">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-10 w-10 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Step 2<br />
                  <span className="text-cyan-600">Report</span>
                </h3>
                <p className="text-gray-600">
                  Report environmental concerns and water quality issues through
                  our easy-to-use platform.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-none">
              <CardContent className="pt-8 px-6 pb-6 text-center">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Droplet className="h-10 w-10 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Step 3<br />
                  <span className="text-cyan-600">Take Action</span>
                </h3>
                <p className="text-gray-600">
                  Join community clean-up efforts, advocate for policy change,
                  and spread awareness.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link href="/register">
              <Button className="bg-cyan-500 text-white px-8">
                Join the Movement
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
                Supporting Sustainable Development Goal 6
              </h2>
              <p className="text-gray-600 mb-8">
                Our mission aligns with SDG 6: Ensure availability and
                sustainable management of water and sanitation for all. We're
                committed to improving water quality, increasing water-use
                efficiency, and protecting water-related ecosystems.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-cyan-600">→</div>
                  <p className="text-gray-700">
                    Improve water quality by reducing pollution
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-cyan-600">→</div>
                  <p className="text-gray-700">
                    Increase water-use efficiency across all sectors
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-cyan-600">→</div>
                  <p className="text-gray-700">
                    Protect and restore water-related ecosystems
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-cyan-600 text-center mb-8">
                Our Impact So Far
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-600">500+</p>
                  <p className="text-gray-600">Water Sources Monitored</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-600">10K+</p>
                  <p className="text-gray-600">Community Members</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-600">200+</p>
                  <p className="text-gray-600">Clean-up Events</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-600">50+</p>
                  <p className="text-gray-600">Partner Organizations</p>
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
            Our Key Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Droplet className="h-10 w-10 text-cyan-600" />,
                title: "Water Quality Testing",
                description:
                  "Access real-time data on water quality parameters including pH, dissolved oxygen, turbidity, and contaminants.",
              },
              {
                icon: <MapPin className="h-10 w-10 text-cyan-600" />,
                title: "Interactive Mapping",
                description:
                  "Visualize water quality data across different regions and identify pollution hotspots in your community.",
              },
              {
                icon: <Users className="h-10 w-10 text-cyan-600" />,
                title: "Community Engagement",
                description:
                  "Connect with local volunteers, organize clean-up events, and collaborate on water conservation projects.",
              },
              {
                icon: <BarChart2 className="h-10 w-10 text-cyan-600" />,
                title: "Data Analytics",
                description:
                  "Track water quality trends over time and measure the impact of conservation efforts in your area.",
              },
              {
                icon: <Globe className="h-10 w-10 text-cyan-600" />,
                title: "Educational Resources",
                description:
                  "Access comprehensive learning materials about water conservation, pollution prevention, and sustainable practices.",
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-cyan-600" />,
                title: "Advocacy Tools",
                description:
                  "Get resources to contact local officials, create petitions, and advocate for stronger water protection policies.",
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
            Voices from Our Community
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The water monitoring tools provided by JERNIH have transformed how our community approaches conservation. We've seen measurable improvements in our local river quality.",
                name: "Sarah Johnson",
                role: "Community Leader",
              },
              {
                quote:
                  "As a teacher, I've used JERNIH's educational resources to inspire my students about water conservation. The interactive tools make learning engaging and impactful.",
                name: "Michael Chen",
                role: "Environmental Educator",
              },
              {
                quote:
                  "The data collected through JERNIH's platform helped us secure funding for a major clean-up project. Their advocacy support was instrumental in our success.",
                name: "Amara Okafor",
                role: "Environmental Activist",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-cyan-50 shadow-sm border-none">
                <CardContent className="p-6">
                  <p className="italic text-gray-700 mb-4">
                    "{testimonial.quote}"
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
              Join Our Mission for Clean Water
            </h2>
            <p className="mb-8 text-cyan-50">
              Together, we can ensure clean water for all. Sign up today to
              receive updates, volunteer opportunities, and ways to get involved
              in your community.
            </p>
            <SubscribeForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>

    </div>
  );
}
