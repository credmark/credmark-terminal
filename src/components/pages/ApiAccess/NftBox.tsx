import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react';
import React from 'react';

import {
  CmkLogoIcon,
  MdDiamondIcon,
  MdRocketLaunchIcon,
} from '~/components/icons';

export default function NftBox() {
  return (
    <Box w="full" bg="white" p={'5'} roundedBottomLeft="sm" shadow="md">
      <Stack direction="row" spacing="8">
        <Text fontSize="2xl" fontWeight="thin">
          Your Credmark Membership NFT
        </Text>
        <Button colorScheme="purple" variant="outline">
          Coming Soon...
        </Button>
      </Stack>

      <HStack align="center" mt={4} spacing="8">
        <HStack>
          <CmkLogoIcon color="purple.500" boxSize="5" />
          <Text fontSize="sm">
            Access the Credmark ecosystem in a unique way
          </Text>
        </HStack>
        <HStack>
          <MdRocketLaunchIcon color="purple.500" boxSize="5" />
          <Text fontSize="14" fontWeight={'400'}>
            Earn &amp; boost staking rewards for your CMK
          </Text>
        </HStack>
        <HStack mb="4">
          <MdDiamondIcon color="purple.500" boxSize="5" />
          <Text fontSize="14" fontWeight={'400'}>
            Get your personal access NFT
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
}
