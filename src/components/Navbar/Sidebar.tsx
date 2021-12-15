import { Img } from '@chakra-ui/image';
import { Box, Link, VStack } from '@chakra-ui/layout';
import { Icon, useDisclosure } from '@chakra-ui/react';
import { Collapse } from '@chakra-ui/transition';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { IoLogoDiscord, IoLogoTwitter, IoMenuOutline } from 'react-icons/io5';

import { useOnClickOutside } from '~/hooks/useOnClickOutside';

export default function Sidebar() {
  const ref = useRef(null);
  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 80) {
        setScrolled(true);
        onClose();
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onClose]);

  useOnClickOutside(ref, onClose);

  const expanded = !scrolled || isOpen;

  return (
    <Box
      ref={ref}
      zIndex="9999"
      position="fixed"
      left="0"
      top={{ base: 24, lg: 6 }}
      maxW={expanded ? '120px' : '64px'}
      _hover={
        !expanded
          ? {
              cursor: 'pointer',
              shadow: '2xl',
            }
          : {}
      }
      onClick={() => (!expanded ? onToggle() : undefined)}
      p="4"
      bg="white"
      shadow="lg"
      roundedRight="3xl"
      transitionProperty="width,box-shadow"
      transitionDuration="normal"
    >
      {!expanded && <Icon as={IoMenuOutline} boxSize={8} color="purple.500" />}
      <Collapse in={expanded} animateOpacity>
        <VStack spacing="8">
          <Link href="https://www.credmark.com/" isExternal>
            <Img src="/img/cmk.png" h="8" />
          </Link>
          <VStack spacing="6">
            <NextLink href="/" passHref>
              <Link
                fontFamily="Credmark Regular"
                fontSize="sm"
                textAlign="center"
                color={
                  router.pathname === '/' && router.query.stake !== 'true'
                    ? 'pink.500'
                    : 'purple.500'
                }
              >
                HOME
              </Link>
            </NextLink>
            <NextLink href="/?stake=true" passHref>
              <Link
                fontFamily="Credmark Regular"
                fontSize="sm"
                textAlign="center"
                color={
                  router.pathname === '/' && router.query.stake === 'true'
                    ? 'pink.500'
                    : 'purple.500'
                }
              >
                STAKE
              </Link>
            </NextLink>
            <NextLink href="/terminal" passHref>
              <Link
                fontFamily="Credmark Regular"
                fontSize="sm"
                textAlign="center"
                color={
                  router.pathname === '/terminal' ? 'pink.500' : 'purple.500'
                }
                lineHeight="1"
              >
                RISK
                <br />
                TERMINAL
              </Link>
            </NextLink>
            <Link
              href="https://smartpool.credmark.com/"
              isExternal
              fontFamily="Credmark Regular"
              fontSize="sm"
              textAlign="center"
              color={'purple.500'}
              lineHeight="1"
            >
              SMART
              <br />
              POOL
            </Link>
            <Link
              href="https://docs.credmark.com/credmark-risk-library/"
              isExternal
              fontFamily="Credmark Regular"
              fontSize="sm"
              textAlign="center"
              color={'purple.500'}
              lineHeight="1"
            >
              RISK
              <br />
              LIBRARY
            </Link>
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
