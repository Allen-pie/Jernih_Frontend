import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchVolunteerOpportunitiesWithAssets = async () => {
    // Fetch volunteer opportunities from Supabase (the 'conservation' table)
    const { data: opportunities, error: opportunitiesError } = await supabase
      .from('conservation')  // Ensure this matches your Supabase table name
      .select('*');
  
    console.log("Fetched Opportunities:", opportunities); // Debugging log
  
    if (opportunitiesError) {
      console.error("Error fetching volunteer opportunities:", opportunitiesError);
      return [];
    }
  
    // For each conservation opportunity, fetch the associated assets (images)
    const opportunitiesWithAssets = await Promise.all(
      opportunities.map(async (opp) => {
        console.log("Fetching assets for opportunity:", opp.id);  // Debugging log
  
        const { data: assets, error: assetsError } = await supabase
          .from('assets')  // Your assets table name
          .select('*')
          .eq('model_id', opp.id)  // Correctly filter by conservation's ID
          .eq('model_type', 'conservation');  // Ensure this matches 'conservation' as a model type
  
        if (assetsError) {
          console.error(`Error fetching assets for conservation event ${opp.id}:`, assetsError);
          return { ...opp, assets: [] };  // Return the conservation opportunity without assets if there's an error
        }
  
        console.log("Fetched Assets:", assets);  // Debugging log
        return { ...opp, assets };  // Attach the assets to the conservation event
      })
    );
  
    return opportunitiesWithAssets;
  };
  