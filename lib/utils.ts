import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from '@/supabase';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchImageUrl(path: string): Promise<string> {
  try {
    const { data: publicUrlData, error: publicUrlError } = supabase
      .storage
      .from('jernih') // Your bucket name
      .getPublicUrl(`${path}`);

    if (publicUrlError) {
      console.error('Error fetching public URL:', publicUrlError);
      return '';
    }

    return publicUrlData?.publicUrl || '';
  } catch (error: any) {
    console.error('Error fetching image:', error.message);
    return '';
  }
}

export async function fetchDefaultImageUrl(): Promise<string> {
  try {
    const { data: publicUrlData, error: publicUrlError } = supabase
      .storage
      .from('jernih') // Bucket name
      .getPublicUrl('locations/default-image.jpg'); // Path to default image

    if (publicUrlError) {
      console.error('Error fetching default image URL:', publicUrlError);
      return '';
    }

    return publicUrlData?.publicUrl || '';
  } catch (error: any) {
    console.error('Error fetching default image:', error.message);
    return '';
  }
}