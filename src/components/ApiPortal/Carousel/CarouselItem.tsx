import { Box, Button, Flex, HStack, Img, Stack, Text } from '@chakra-ui/react';
import React from 'react';

export interface CarouselItemProps {
  title: string;
  description: string;
  lists: {
    text: string;
    icon: string;
  }[];
  isAccess: boolean;
  isBackground: boolean;
}

export default function CarouselItem(item: CarouselItemProps) {
  return (
    <Box bg="white" h="300px">
      <Flex mx={2}>
        <Stack p={4} spacing={4}>
          <Stack spacing={0} align="flex-start">
            <Text fontSize="2xl" fontWeight="bold">
              {item.title}
            </Text>
            <Text fontSize="md">{item.description}</Text>
          </Stack>
          <Stack>
            {item.lists.map((item) => (
              <HStack key={item.text}>
                <Img src={item.icon} />
                <Text fontSize="sm">{item.text}</Text>
              </HStack>
            ))}
          </Stack>

          {item.isAccess ? (
            <Button alignSelf="flex-start" colorScheme="pink">
              <Img src="/img/apiPortal/white_lock.svg" mr="1" />
              Get Access
            </Button>
          ) : (
            <Button disabled alignSelf="flex-start" colorScheme="pink">
              Coming Soon...
            </Button>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
