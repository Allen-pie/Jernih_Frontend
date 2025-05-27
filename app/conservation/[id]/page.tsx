import { fetchVolunteerById } from '@/utils/supabase/conservation';
import { fetchImageUrl, fetchDefaultImageUrl } from '@/utils/supabase/client';
import OpportunityClientView from '@/components/OpportunityClientView';

interface Props {
  params: {
    id: string;
  };
}

const OpportunityDetailPage = async ({ params }: Props) => {
  const oppId = parseInt(params.id);
  const opp = await fetchVolunteerById(oppId);
  if (!opp) return null;

  const imageUrl = opp.imageUrl
    ? await fetchImageUrl(opp.imageUrl)
    : await fetchDefaultImageUrl();

  return <OpportunityClientView opp={opp} imageUrl={imageUrl} />;
};

export default OpportunityDetailPage;
