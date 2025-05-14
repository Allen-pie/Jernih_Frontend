// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useImage } from "@/hooks/useImage";
import { useLogoImage } from "@/hooks/useLogoImage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/context/AuthContext";
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

export default function HomePage() {
  const { signOut, session } = useAuth();
  const router = useRouter();

  const heroUrl = useImage("landing-page.jpg");
  const logoUrl = useLogoImage("jernih-logo.svg");
  const childSignUrl = useImage("child_sign.jpg");
  const childWaterUrl = useImage("child_water.png");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (session) return null; // prevent UI flicker

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="w-full fixed top-0 z-50">
        <div className="container mx-auto px-8 sm:px-16 md:px-28 lg:px-32 py-3 flex justify-between items-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              width={150}
              height={100}
              alt="Jernih Logo"
              className="transition-opacity duration-300 opacity-100"
            />
          ) : (
            <div className="w-[150px] h-[100px] bg-white/40 animate-pulse rounded" />
          )}
          {/* Nav menu + auth buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <SiteNav />

            {session ? (
              /* profile popover */
              <Popover>{/* ... */}</Popover>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button here if you have one */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 z-0">
          {heroUrl && (
            <Image
              src={heroUrl}
              alt="Clean water background"
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="absolute inset-0 bg-cyan-900/10 z-10"></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Monitor Water Quality in Real-Time. Take Action Today
            </h1>
            <p className="text-lg text-gray-900 mb-8">
              Join thousands protecting our waters. Report pollution, track
              clean-up efforts, and access vital data to preserve our most
              precious resource.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button className="px-6 py-6">Get Started</Button>
              </Link>
              <Link href="/login?redirect=/dashboard">
                <Button
                  variant="ghost"
                  className="px-6 py-6 rounded-md hover:bg-cyan-50 hover:text-cyan-600"
                >
                  <span className="underline ml-2">Explore Our Data→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-20 bg-white">
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
      </section>

      {/* How You Can Make a Difference */}
      <section
        id="solution"
        className="py-20 bg-gray-50 border-t border-b border-gray-200"
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
      </section>

      {/* Our Mission & Impact */}
      <section id="impact" className="py-20 bg-white">
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
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
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
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
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
      </section>

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
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  width={150}
                  height={100}
                  alt="Jernih Logo"
                />
              ) : (
                <span className="h-8 w-8 mr-2 bg-white text-blue-800 font-bold flex items-center justify-center rounded">
                  Jernih
                </span>
              )}
              <p className="text-gray-400 mb-4">
                Dedicated to protecting water resources and ensuring clean water
                access for all.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Communities
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Education & Resources
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Volunteer
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Donate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">info@jernih.org</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
                <li className="text-gray-400">123 Water St, Earth City</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 JERNIH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
