import { Box, Button, Container, Flex } from '@chakra-ui/react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import React, { FC } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import CarouselItem from './CarouselItem';

interface ChartsCarouselItemProps {
  title: string;
  description: string;
  lists: {
    text: string;
    icon: JSX.Element;
  }[];
  isAccess: boolean;
  isBackground: boolean;
}
interface ChartsCarouselProps {
  item: Array<ChartsCarouselItemProps>;
}

const ChartsCarousel: FC<ChartsCarouselProps> = ({ item }) => {
  const items = item;
  return (
    <Container maxW="container.xl" my={8}>
      <CarouselProvider
        naturalSlideWidth={150}
        naturalSlideHeight={125}
        touchEnabled={true}
        totalSlides={3}
        visibleSlides={2}
      >
        <Flex zIndex="50" justify="space-between" position="relative" top="170">
          <Button
            color="white"
            bg="pink.600"
            _hover={{
              bg: 'transparent',
              color: 'pink.600',
            }}
            pos="relative"
            as={ButtonBack}
            p="0"
            borderRadius="full"
            fontSize="3xl"
          >
            <FaAngleLeft />
          </Button>
          <Button
            color="white"
            bg="pink.600"
            _hover={{
              bg: 'transparent',
              color: 'pink.600',
            }}
            pos="relative"
            as={ButtonNext}
            p="0"
            borderRadius="full"
            fontSize="3xl"
          >
            <FaAngleRight />
          </Button>
        </Flex>
        <Slider>
          {items.map((item, i) => (
            <Slide index={i} key={i}>
              <Box mr={10}>
                <CarouselItem item={item} />
              </Box>
            </Slide>
          ))}
        </Slider>
      </CarouselProvider>
    </Container>
  );
};
export default ChartsCarousel;
