import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  Img,
} from '@chakra-ui/react';
import React, { FC } from 'react';
interface ICarouselItem {
  title: string;
  description: string;
  lists: {
    text: string;
    icon: string;
  }[];
  isAccess: boolean;
  isBackground: boolean;
}
interface CarouselItemProps {
  item: ICarouselItem;
}

type Item = {
  text: string;
  icon: string;
};

const CarouselItem: FC<CarouselItemProps> = ({ item }) => {
  return (
    <Box bg="white">
      <Flex mx={2}>
        <Stack p={4} spacing={4}>
          <Stack spacing={0} align="flex-start">
            <Heading>{item.title}</Heading>
            <Text fontSize="xl">{item.description}</Text>
          </Stack>
          <Stack>
            {item.lists.map((item: Item) => (
              <HStack key={item.text}>
                <Img src={'/img/apiPortal/' + item.icon} />
                <Text fontSize="sm">{item.text}</Text>
              </HStack>
            ))}
          </Stack>

          {item.isAccess ? (
            <Button alignSelf="flex-start" colorScheme="pink">
              <Img src="/img/apiPortal/white_lock.svg" />
              Get Access
            </Button>
          ) : (
            <Button disabled alignSelf="flex-start" colorScheme="pink">
              Coming Soon...
            </Button>
          )}
        </Stack>
        {item.isBackground && (
          <Flex justify="center" align="center" flex="1">
            <Img src="/img/apiPortal/carousel.svg" alt="chart" />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
export default CarouselItem;
