"use client";

import React from 'react';
import { Card, Text, Flex, Theme, Button , Link} from '@radix-ui/themes';
import Image from 'next/image';
import { DashboardHeader } from '@/components/dashboard-header';

interface Opportunity {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
}

interface Props {
  opp: Opportunity;
  imageUrl: string;
}

const OpportunityClientView = ({ opp, imageUrl }: Props) => {
  if (!opp) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Text color="red" size="4" weight="bold">
          Opportunity not found.
        </Text>
      </Flex>
    );
  }

  return (
    <Theme>
      <DashboardHeader />
      <Flex direction="column" align="center" gap="4" px="4" py="6">
        <Card variant="classic" style={{ width: '100%', maxWidth: 720 }}>
          <Flex direction="column" gap="4">
            {imageUrl && (
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Image
                  src={imageUrl}
                  alt={opp.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )}

            <Flex direction="column" gap="2" px="4" pt="2" pb="4">
              <Text as="div" size="5" weight="bold">
                {opp.title}
              </Text>

              <Text as="div" color="gray" size="3">
                Location: {opp.location}
              </Text>

              <Text as="div" size="3" style={{ whiteSpace: 'pre-line' }}>
                {opp.description}
              </Text>
                
            <Button asChild size="3" variant="soft">
                <Link href={opp.link} target="_blank" rel="noopener noreferrer">
                    Register
                </Link>
            </Button>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Theme>
  );
};

export default OpportunityClientView;
