import { Box, Button, Container, Flex, useMediaQuery } from '@chakra-ui/react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import React, { FC } from 'react';
import { IoChevronForward, IoChevronBack } from 'react-icons/io5';

import CarouselItem from './CarouselItem';

interface ChartsCarouselItemProps {
  title: string;
  description: string;
  lists: {
    text: string;
    icon: string;
  }[];
  isAccess: boolean;
  isBackground: boolean;
}
interface ChartsCarouselProps {
  item: Array<ChartsCarouselItemProps>;
}

const ChartsCarousel: FC<ChartsCarouselProps> = ({ item }) => {
  const items = item;

  const [isDesktop] = useMediaQuery('(min-device-width: 1024px)');
  const [isTablet] = useMediaQuery('(min-device-width: 600px)');
  const slideCount = isDesktop ? 2.5 : isTablet ? 1.5 : 1;

  return (
    <Container maxW="container.xl" my={8}>
      <CarouselProvider
        naturalSlideWidth={150}
        naturalSlideHeight={125}
        touchEnabled={true}
        totalSlides={3}
        visibleSlides={slideCount}
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
            <IoChevronBack />
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
            <IoChevronForward />
          </Button>
        </Flex>
        <Slider>
          {items.map((item, i) => (
            <Slide index={i} key={i}>
              <Box m={5}>
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
