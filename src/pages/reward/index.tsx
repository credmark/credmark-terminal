import {
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  Center,
  HStack,
} from '@chakra-ui/react';
import React from 'react';
import { IoArrowForwardOutline } from 'react-icons/io5';

import PackageCard from '~/components/ApiPortal/PackageCard';
const packages = () => {
  const packagesList = [
    {
      name: 'Starter',
      benefits: [
        {
          icon: '/img/apiPortal/credmark.svg',
          text: 'Stake CMK',
          access: true,
        },
        {
          icon: '/img/apiPortal/dollar.svg',
          text: 'free',
          access: true,
        },
        {
          icon: '/img/apiPortal/unlock.svg',
          text: 'No Lockup Period',
          access: true,
        },
        {
          icon: '/img/apiPortal/code.svg',
          text: 'Model Framework',
          access: true,
        },
        {
          icon: '/img/apiPortal/disabled_pc.svg',
          text: 'Risk Terminal Access',
          access: false,
        },
        {
          icon: '/img/apiPortal/disabled_gateway.svg',
          text: 'API Gateaway Access',
          access: false,
        },
        {
          icon: '/img/apiPortal/disabled_report.svg',
          text: 'Custom Model & Reports',
          access: false,
        },
      ],
      price: 0,
    },
    {
      name: 'Pro',
      benefits: [
        {
          icon: '/img/apiPortal/credmark.svg',
          text: 'Stake CMK',
          access: true,
        },
        {
          icon: '/img/apiPortal/dollar.svg',
          text: '$35 per month*',
          access: true,
        },
        {
          icon: '/img/apiPortal/unlock.svg',
          text: '1 Week Lockup Period',
          access: true,
        },
        {
          icon: '/img/apiPortal/code.svg',
          text: 'Model Framework',
          access: true,
        },
        {
          icon: '/img/apiPortal/pc.svg',
          text: 'Credmark Terminal Access',
          access: true,
        },
        {
          icon: '/img/apiPortal/disabled_gateway.svg',
          text: 'API Gateaway Access',
          access: false,
        },
        {
          icon: '/img/apiPortal/disabled_report.svg',
          text: 'Custom Model & Reports',
          access: false,
        },
      ],
      price: 50,
    },
    {
      name: 'Unlimited',
      benefits: [
        {
          icon: '/img/apiPortal/credmark.svg',
          text: 'Stake CMK',
          access: true,
        },
        {
          icon: '/img/apiPortal/dollar.svg',
          text: '$350 per month',
          access: true,
        },
        {
          icon: '/img/apiPortal/unlock.svg',
          text: '1 Month Lockup Period',
          access: true,
        },
        {
          icon: '/img/apiPortal/code.svg',
          text: 'Model Framework',
          access: true,
        },
        {
          icon: '/img/apiPortal/pc.svg',
          text: 'Credmark Terminal Access',
          access: true,
        },
        {
          icon: '/img/apiPortal/gateway.svg',
          text: 'API Gateaway Access',
          access: true,
        },
        {
          icon: '/img/apiPortal/disabled_report.svg',
          text: 'Custom Model & Reports',
          access: false,
        },
      ],
      price: 100,
    },
    {
      name: 'Premium',
      benefits: [
        {
          icon: '/img/apiPortal/credmark.svg',
          text: 'Stake CMK',
          access: true,
        },
        {
          icon: '/img/apiPortal/dollar.svg',
          text: '$ 3500 per month*',
          access: true,
        },
        {
          icon: '/img/apiPortal/unlock.svg',
          text: '1 Year Lockup Period',
          access: true,
        },
        {
          icon: '/img/apiPortal/code.svg',
          text: 'Model Framework',
          access: true,
        },
        {
          icon: '/img/apiPortal/pc.svg',
          text: 'Risk Terminal Access',
          access: true,
        },
        {
          icon: '/img/apiPortal/gateway.svg',
          text: 'API Gateaway Access',
          access: true,
        },
        {
          icon: '/img/apiPortal/report.svg',
          text: 'Custom Model & Reports',
          access: true,
        },
      ],
      price: 1000,
    },
  ];

  return (
    <Container maxW="container.xl">
      <Center>
        <Text
          mb="8"
          mt="5"
          fontSize={{ sm: 'xl', md: '3xl' }}
          textAlign="center"
          maxW="1000px"
        >
          Select a Membership to Gain Access to our Tools and Start
          <br /> Earning Rewards
        </Text>
      </Center>

      <Grid gridTemplateColumns="repeat(auto-fit,minmax(250px,1fr))" gap="4">
        {packagesList.map((item, i) => (
          <PackageCard index={i} item={item} key={item.name} />
        ))}
      </Grid>
      <VStack pb="10">
        <HStack mt="6">
          <Heading fontSize="md" as="h4">
            Need Help? Check Out Our FAQ
          </Heading>
          <IoArrowForwardOutline />
        </HStack>
        <Text color="gray.200" textAlign="center" fontSize="sm">
          *Costs are denominated in USD, and access is stored as staked CMK.
          Changes <br /> in the price are subject to a DAO Governance Vote.
        </Text>
      </VStack>
    </Container>
  );
};

export default packages;
