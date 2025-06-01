import { fetchVolunteerById } from '@/utils/supabase/conservation';
import { fetchImageUrl} from '@/utils/supabase/client';
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

  const imageUrl = await fetchImageUrl(opp.imageUrl)

  return <OpportunityClientView opp={opp} imageUrl={imageUrl} />;
};

export default OpportunityDetailPage;
