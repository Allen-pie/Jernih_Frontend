import {supabase} from './client'
import { fetchImageUrl } from '@/utils/supabase/client';
export const fetchVolunteerById = async (id: number | string) => {
  // Fetch a single conservation opportunity by ID
  const { data: opp, error: oppError } = await supabase
    .from('conservation')
    .select('*')
    .eq('id', id)
    .single();

  if (oppError) {
    console.error(`Error fetching conservation opportunity with ID ${id}:`, oppError);
    return null;
  }

  // Fetch the related image asset
  const { data: assets, error: assetError } = await supabase
    .from('assets')
    .select('*')
    .eq('model_id', id)
    .eq('model_type', 'conservation');

  let imageUrl = '';

  if (assets && assets.length > 0) {
    imageUrl = await fetchImageUrl(assets[0].path);
  } else {
    console.warn(`No asset found for conservation ID ${id}:`, assetError);
    imageUrl = await fetchImageUrl('locations/default-image.jpg');
  }

  return {
    ...opp,
    imageUrl,
    assets: assets ?? [],
  };
};

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
      // console.log("Fetching assets for opportunity:", opp.id);

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