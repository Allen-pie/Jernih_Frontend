"use client";
import { fetchVolunteerById } from '@/utils/supabase/conservation';
import OpportunityClientView from '@/components/OpportunityClientView';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';


const OpportunityDetailPage =  () => {
  const params = useParams();
  const oppId = parseInt(params?.id as string);
  const [loading, setLoading] = useState(true);
  const [opp, setOpp] = useState<any>(null);
 

   useEffect(() => {
      const fetchArticle = async () => {
        try {
          const data = await fetchVolunteerById(oppId);
          setOpp(data);
        } catch (error) {
          console.error('Error fetching:', error);
          setOpp(null);
        } finally {
          setLoading(false);
        }
      };
  
      if (!isNaN(oppId)) {
        fetchArticle();
      } else {
        setLoading(false);
      }
    }, [oppId]);

  if (!opp && !loading) return <div>Opportunity not found</div>;

  return <OpportunityClientView opp={opp} />;

};

export default OpportunityDetailPage;
