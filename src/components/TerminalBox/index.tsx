import { Img, LinkBox, LinkOverlay, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

export default function TerminalBox() {
  return (
    <LinkBox
      as={VStack}
      alignSelf="center"
      flex="1"
      bg="white"
      py="4"
      px="8"
      shadow="lg"
      rounded="3xl"
      spacing="4"
      cursor="pointer"
      _hover={{
        shadow: '2xl',
      }}
      _active={{
        transform: 'scale(0.98)',
        shadow: 'md',
      }}
      transitionProperty="width,height,box-shadow"
      transitionDuration="normal"
    >
      <Img src="/img/terminal.svg" h="72px" />
      <NextLink href="/terminal" passHref>
        <LinkOverlay>
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            bgGradient="linear(135deg, #08538C, #3B0065)"
            bgClip="text"
            lineHeight="1"
          >
            <Text as="span" fontSize="3xl" lineHeight="1.2">
              RISK TERMINAL
            </Text>
            <br />
            <Text as="span" fontSize="md">
              HIGH INTEGRITY DEFI DATA
            </Text>
            <br />
            <Text as="span" fontSize="xs">
              <Text as="span" fontFamily="Roboto">
                *
              </Text>
              REQUIRES xCMK TO ACCESS
              <Text as="span" fontFamily="Roboto">
                *
              </Text>
            </Text>
          </Text>
        </LinkOverlay>
      </NextLink>
    </LinkBox>
  );
}
