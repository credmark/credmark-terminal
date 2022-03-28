import { Box, Button, Flex, useMediaQuery } from '@chakra-ui/react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import React from 'react';
import { IoChevronForward, IoChevronBack } from 'react-icons/io5';

import CarouselItem, { CarouselItemProps } from './CarouselItem';

interface CarouselProps {
  items: Array<CarouselItemProps>;
}

export default function Carousel({ items }: CarouselProps) {
  const [isDesktop] = useMediaQuery('(min-device-width: 1024px)');
  const [isTablet] = useMediaQuery('(min-device-width: 600px)');
  const slideCount = isDesktop ? 2.5 : isTablet ? 1.5 : 1;

  return (
    <CarouselProvider
      naturalSlideWidth={150}
      naturalSlideHeight={125}
      touchEnabled={true}
      totalSlides={3}
      visibleSlides={slideCount}
    >
      <Flex
        zIndex="50"
        justify="space-between"
        position="relative"
        top="170"
        px="4"
      >
        <Button
          pos="relative"
          as={ButtonBack}
          p="0"
          colorScheme="pink"
          rounded="full"
          fontSize="3xl"
        >
          <IoChevronBack />
        </Button>
        <Button
          pos="relative"
          as={ButtonNext}
          p="0"
          colorScheme="pink"
          rounded="full"
          fontSize="3xl"
        >
          <IoChevronForward />
        </Button>
      </Flex>
      <Slider>
        {items.map((item, i) => (
          <Slide index={i} key={i}>
            <Box mx={8}>
              <CarouselItem {...item} />
            </Box>
          </Slide>
        ))}
      </Slider>
    </CarouselProvider>
  );
}
