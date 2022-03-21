import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  Img,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { AiFillLock } from 'react-icons/ai';
interface ICarouselItem {
  title: string;
  description: string;
  lists: {
    text: string;
    icon: JSX.Element;
  }[];
  isAccess: boolean;
  isBackground: boolean;
}
interface CarouselItemProps {
  item: ICarouselItem;
}

type Item = {
  text: string;
  icon: JSX.Element;
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
                <Icon color="purple.800" fontSize="xl">
                  {item.icon}
                </Icon>
                <Text fontSize="sm">{item.text}</Text>
              </HStack>
            ))}
          </Stack>

          {item.isAccess ? (
            <Button alignSelf="flex-start" colorScheme="pink">
              <Icon fontSize="lg" mr={1}>
                <AiFillLock />
              </Icon>
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
