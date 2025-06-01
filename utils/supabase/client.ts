import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);


export async function fetchImageUrl(path: string): Promise<string> {
  try {
    const { data: publicUrlData } = supabase
      .storage
      .from('jernih') // Your bucket name
      .getPublicUrl(`${path}`);


    return publicUrlData?.publicUrl || 'locations/default-image.jpg';
  } catch (error: any) {
    console.error('Error fetching image:', error.message);
    return '';
  }
}