"use client";
import Image from "next/image";
import { FacebookIcon, TwitterIcon, InstagramIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-4 md:mb-0">
           
              <Image
                src={'/assets/jernihLogo.svg'}
                width={150}
                height={100}
                alt="Jernih Logo"
                className="transition-opacity duration-300 opacity-100"
              />
            
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-300 transition-colors">
              <FacebookIcon size={24} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <TwitterIcon size={24} />
            </a>
            <a href="#" className="hover:text-blue-300 transition-colors">
              <InstagramIcon size={24} />
            </a>
          </div>
        </div>
        <div className="border-t border-blue-700 pt-6 pb-4 text-center text-blue-200 text-sm">
          <p>© 2025 Jernih. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            {" • "}
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>


  );
}
