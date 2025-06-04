import { fetchVolunteerById } from '@/utils/supabase/conservation';
import OpportunityClientView from '@/components/OpportunityClientView';

interface Props {
  params: { id: string };
}

const OpportunityDetailPage = async ({ params } : Props) => {
  const { id }  = await params
  const oppId = parseInt(id);
  const opp = await fetchVolunteerById(oppId);
  // const safeOpp = JSON.parse(JSON.stringify(opp));
  if (!opp) return <div>Opportunity not found</div>;

  return <OpportunityClientView opp={opp} />;
};

export default OpportunityDetailPage;
