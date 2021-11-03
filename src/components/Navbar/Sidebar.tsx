import { Img } from '@chakra-ui/image';
import { Box, VStack, Text, Link } from '@chakra-ui/layout';
import { Icon, useDisclosure } from '@chakra-ui/react';
import { Collapse } from '@chakra-ui/transition';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { IoMenuOutline, IoLogoTwitter, IoLogoDiscord } from 'react-icons/io5';

export default function Sidebar() {
  const { isOpen, onToggle } = useDisclosure();

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 80) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const expanded = !scrolled || isOpen;

  return (
    <Box
      zIndex="9999"
      position="fixed"
      left="0"
      top={{ base: 24, lg: 6 }}
      maxW={expanded ? '120px' : '64px'}
      _hover={
        !expanded
          ? {
              cursor: 'pointer',
            }
          : {}
      }
      onClick={() => (!expanded ? onToggle() : undefined)}
      p="4"
      bg="white"
      shadow="lg"
      roundedRight="3xl"
      transitionProperty="width"
      transitionDuration="normal"
    >
      {!expanded && <Icon as={IoMenuOutline} boxSize={8} />}
      <Collapse in={expanded} animateOpacity>
        <VStack spacing="8">
          <Img src="/img/cmk.png" h="8" />
          <VStack>
            <NextLink href="/" passHref>
              <Link
                fontFamily="Credmark Regular"
                fontSize="sm"
                textAlign="center"
                color="purple.500"
              >
                HOME
              </Link>
            </NextLink>
            <NextLink href="/terminal" passHref>
              <Link
                fontFamily="Credmark Regular"
                fontSize="sm"
                textAlign="center"
                color="purple.500"
              >
                THE
                <br />
                TERMINAL
              </Link>
            </NextLink>
          </VStack>
          <VStack>
            <Link
              href="https://twitter.com/credmarkhq"
              isExternal
              fontFamily="Credmark Regular"
              fontSize="lg"
              textAlign="center"
              color="purple.500"
            >
              <Icon as={IoLogoTwitter} />
            </Link>
            <Link
              href="https://discord.com/invite/BJbYSRDdtr"
              isExternal
              fontFamily="Credmark Regular"
              fontSize="lg"
              textAlign="center"
              color="purple.500"
            >
              <Icon as={IoLogoDiscord} />
            </Link>
          </VStack>
        </VStack>
      </Collapse>
    </Box>
  );
}
