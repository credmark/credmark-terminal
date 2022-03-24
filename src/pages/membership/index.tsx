import { Button, Flex, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import BalanceCard from '~/pages/membership/Cards/BalanceCard';
import { Card } from '~/pages/membership/Cards/Card';
import MembershipDetailsCard from '~/pages/membership/Cards/MembershipDetailsCard';
import RemainingDaysCard from '~/pages/membership/Cards/RemainingDaysCard';
import RewardCard from '~/pages/membership/Cards/RewardCard';

const Membership = () => {
  return (
    <Flex w="full" minH="100%">
      <Grid
        padding="8"
        templateRows={{ sm: 'repeat(8, 1fr)', lg: 'repeat(7, 1fr)' }}
        templateColumns={{ sm: 'repeat(8, 1fr)', lg: 'repeat(9, 1fr)' }}
        width="full"
        flex="1"
        gap="4"
        bg="gray.50"
      >
        <GridItem colSpan={{ sm: 8, lg: 5 }} rowSpan={{ sm: 1, lg: 2 }}>
          <BalanceCard />
        </GridItem>
        <GridItem colSpan={{ sm: 4, lg: 2 }} rowSpan={{ sm: 1, lg: 2 }}>
          <RewardCard />
        </GridItem>
        <GridItem colSpan={{ sm: 4, lg: 2 }} rowSpan={{ sm: 1, lg: 2 }}>
          <RemainingDaysCard />
        </GridItem>

        <GridItem colSpan={{ sm: 8, lg: 3 }} rowSpan={{ sm: 2, lg: 5 }}>
          <MembershipDetailsCard />
        </GridItem>
        <GridItem
          w="100%"
          colSpan={{ sm: 8, lg: 6 }}
          rowSpan={{ sm: 2, lg: 5 }}
          as={Card}
        >
          {/* Chart here */}
        </GridItem>
        <GridItem
          colStart={{ sm: 7, lg: 8 }}
          colEnd={{ sm: 9, lg: 10 }}
          display="flex"
          justifyContent="center"
        >
          <Button colorScheme="pink" w="full">
            Mint New Key
          </Button>
        </GridItem>
      </Grid>
    </Flex>
  );
};
export default Membership;
