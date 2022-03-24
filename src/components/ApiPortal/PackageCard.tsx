import {
  GridItem,
  VStack,
  Heading,
  Stack,
  HStack,
  Button,
  Text,
  Img,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoArrowForwardOutline } from 'react-icons/io5';

import { IPackageCard } from '~/types/IPackageCard';

interface PackageCardProps {
  item: IPackageCard;
  index: number;
}

const PackageCard: FC<PackageCardProps> = ({ item, index }) => {
  return (
    <GridItem
      key={item.name}
      boxShadow="xl"
      borderRadius="lg"
      overflow="hidden"
      role="group"
      margin="auto"
      w={{ sm: '250px', md: '250px' }}
    >
      <VStack
        transition="0.3s ease"
        py={4}
        px="4"
        bg={item.name === 'Unlimited' ? 'pink.500' : 'white'}
        color={item.name === 'Unlimited' ? 'white' : 'black'}
        _groupHover={{
          bg: 'pink.500',
          color: 'white',
        }}
      >
        <Heading as="h3" size="md">
          {item.name}
        </Heading>
      </VStack>
      <VStack py="4" px="4" maxW="container.sm" bg="white">
        <Text fontSize="xl" textAlign="center">
          {index + 1}X
        </Text>
        <Text fontSize="md" textAlign="center">
          Staking Rewards
        </Text>
        <Stack>
          {item.benefits.map((benefit) => (
            <HStack spacing="3" key={benefit.text} mt="3.5">
              <Img
                src={benefit.icon}
                color={!benefit.access ? 'gray.200' : 'purple.700'}
              />
              <Text
                color={!benefit.access ? 'gray.200' : 'black'}
                fontSize="sm"
              >
                {benefit.text}
              </Text>
            </HStack>
          ))}
        </Stack>
      </VStack>
      <VStack py="6" px="5" bg="white">
        <Button
          transition="0.3s ease"
          _groupHover={{
            bg: 'pink.500',
            color: 'white',
          }}
          bg={item.name === 'Unlimited' ? 'pink.500' : 'white'}
          color={item.name === 'Unlimited' ? 'white' : 'purple'}
          variant="outline"
          w="80%"
        >
          {item.price === 0 ? (
            'Free'
          ) : (
            <>
              {`$${item.price} per month*`}
              <IoArrowForwardOutline />
            </>
          )}
        </Button>
      </VStack>
    </GridItem>
  );
};
export default PackageCard;
