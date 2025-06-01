import {supabase} from './client'
import { fetchImageUrl } from '@/utils/supabase/client';

export async function fetchVolunteerById(id: number | string) {
  // First, fetch the main conservation data
  const { data: conservation, error: conservationError } = await supabase
    .from('conservation')
    .select(`
      id,
      created_at,
      title,
      location,
      description,
      link
    `)
    .eq('id', id)
    .single();

  if (conservationError) {
    console.error(`Error fetching conservation with id ${id}:`, conservationError);
    return null;
  }

  // Now, fetch the asset based on model_id and model_type
  const { data: asset, error: assetError } = await supabase
    .from('assets')
    .select('path')
    .eq('model_id', id)
    .eq('model_type', 'conservation')
    .single();  // assuming only one image per opportunity

  if (assetError) {
    console.warn(`No asset found for conservation id ${id}:`, assetError);
  }

  return {
    id: conservation.id,
    title: conservation.title,
    location: conservation.location,
    description: conservation.description,
    imageUrl: asset?.path
      ? `${asset.path}`
      : '',
    link : conservation.link
  };

  
}

export const fetchVolunteerOpportunitiesWithAssets = async () => {
  // Fetch volunteer opportunities from Supabase (the 'conservation' table)
  const { data: opportunities, error: opportunitiesError } = await supabase
    .from('conservation')
    .select('*');

  if (opportunitiesError) {
    console.error("Error fetching volunteer opportunities:", opportunitiesError);
    return [];
  }

  // For each conservation opportunity, fetch the associated assets (images)
  const opportunitiesWithAssets = await Promise.all(
    opportunities.map(async (opp) => {
      console.log("Fetching assets for opportunity:", opp.id);

      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .eq('model_id', opp.id)
        .eq('model_type', 'conservation');

      if (assetsError) {
        console.error(`Error fetching assets for conservation event ${opp.id}:`, assetsError);
        return {
          ...opp,
          imageUrl: await fetchImageUrl('locations/default-image.jpg'),
          assets: []
        };
      }

      const imageUrl = await fetchImageUrl(assets[0].path); 
      return {
        ...opp,
        imageUrl,
        assets
      };
    })
  );
  return opportunitiesWithAssets;
};