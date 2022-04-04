import { Box, Button, Flex, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import type { IconType } from 'react-icons';
import { MdLock } from 'react-icons/md';

export interface CarouselItemProps {
  title: string;
  description: string;
  lists: {
    text: string;
    icon: IconType | typeof Icon;
  }[];
  isAccess: boolean;
  isBackground: boolean;
}

export default function CarouselItem(item: CarouselItemProps) {
  return (
    <Box bg="white" h="300px" shadow="md" rounded="sm">
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
                <Icon as={item.icon} boxSize="5" color="purple.500" />
                <Text fontSize="sm">{item.text}</Text>
              </HStack>
            ))}
          </Stack>

          {item.isAccess ? (
            <Button
              alignSelf="flex-start"
              colorScheme="pink"
              leftIcon={<Icon as={MdLock} />}
            >
              Get Access
            </Button>
          ) : (
            <Button isDisabled alignSelf="flex-start" colorScheme="pink">
              Coming Soon...
            </Button>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
