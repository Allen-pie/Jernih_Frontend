import { supabase } from './client'
import { Report } from '@/app/interfaces'


export async function getReportsForAdmin(){
    const {data, error} = await supabase.from("pollution_reports").select();
    if (error){
        console.error('Terjadi kesalahan saat mengambil data laporan: ', error.message);
        return [];
    }
    return data as Report[];
}

