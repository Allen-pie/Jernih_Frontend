'use client';

import React, { useState, useEffect } from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react';
import { supabase } from "@/supabase";

export const Footer: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await supabase.from('assets').select('path').limit(1).single();

        if (error) throw error;

        if (data && data.path) {
          const { data: publicUrlData, error: publicUrlError } = supabase
            .storage
            .from('jernih')
            .getPublicUrl(data.path);

          if (publicUrlError) throw publicUrlError;

          setLogoUrl(publicUrlData.publicUrl);
        }
      } catch (error: any) {
        console.error('Error fetching logo:', error.message);
      }
    };

    fetchLogo();
  }, []);

  return (
    <footer className="bg-blue-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 mr-2" />
            ) : (
              <span className="h-8 w-8 mr-2 bg-white text-blue-800 font-bold flex items-center justify-center rounded">
                J
              </span>
            )}
            <h2 className="text-xl font-bold">Jernih</h2>
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
            {' • '}
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
