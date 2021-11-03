import { Img, LinkBox, LinkOverlay, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

export default function TerminalBox() {
  return (
    <LinkBox
      as={VStack}
      w="md"
      p="8"
      bg="white"
      shadow="lg"
      rounded="3xl"
      spacing="6"
      cursor="pointer"
      _hover={{
        shadow: '2xl',
      }}
      transitionProperty="width,height,box-shadow"
      transitionDuration="normal"
    >
      <Img src="/img/terminal.png" w="24" />
      <NextLink href="/terminal" passHref>
        <LinkOverlay>
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            bgGradient="linear(135deg, #CC1662, #3B0066)"
            bgClip="text"
            lineHeight="1.2"
          >
            <Text as="span" fontSize="2xl">
              ACCESS THE
            </Text>
            <br />
            <Text as="span" fontSize="4xl">
              TERMINAL
            </Text>
          </Text>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
}
