import { Button, Flex, Grid, GridItem } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

import DashboardLayout from '~/components/Layout/DashboardLayout/DasboardLayout';
import BalanceCard from '~/components/Membership/BalanceCard';
import { Card } from '~/components/Membership/Card';
import MembershipDetailsCard from '~/components/Membership/MembershipDetailsCard';
import RemainingDaysCard from '~/components/Membership/RemainingDaysCard';
import RewardCard from '~/components/Membership/RewardCard';

const Membership = () => {
  return (
    <Flex w="full" minH="100%">
      <Grid
        padding="4"
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

        <GridItem colSpan={{ sm: 3, lg: 2 }} rowSpan={{ sm: 4, lg: 5 }}>
          <MembershipDetailsCard />
        </GridItem>
        <GridItem
          w="99%"
          colSpan={{ sm: 5, lg: 7 }}
          rowSpan={{ sm: 4, lg: 5 }}
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
          <Button colorScheme="pink" w="full" mx="2">
            Mint New Key
          </Button>
        </GridItem>
      </Grid>
    </Flex>
  );
};
export default Membership;
Membership.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout text="Dashboard">{page}</DashboardLayout>;
};
