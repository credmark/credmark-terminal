import { Img, LinkBox, LinkOverlay, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

export default function TerminalBox() {
  return (
    <LinkBox
      as={VStack}
      flex="1"
      bg="white"
      p="4"
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
      <Img src="/img/terminal.png" w="16" />
      <NextLink href="/terminal" passHref>
        <LinkOverlay>
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            bgGradient="linear(135deg, #CC1662, #3B0066)"
            bgClip="text"
            lineHeight="1"
          >
            <Text as="span" fontSize="xl">
              ACCESS THE
            </Text>
            <br />
            <Text as="span" fontSize="3xl">
              TERMINAL
            </Text>
          </Text>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
}
