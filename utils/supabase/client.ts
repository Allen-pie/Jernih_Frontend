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


    return publicUrlData?.publicUrl || '';
  } catch (error: any) {
    console.error('Error fetching image:', error.message);
    return '';
  }
}

export async function fetchDefaultImageUrl(): Promise<string> {
  try {
    const { data: publicUrlData } = supabase
      .storage
      .from('jernih') // Bucket name
      .getPublicUrl('locations/default-image.jpg'); // Path to default image


    return publicUrlData?.publicUrl || '';
  } catch (error: any) {
    console.error('Error fetching default image:', error.message);
    return '';
  }
}