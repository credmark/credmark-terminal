import { Img } from '@chakra-ui/image';
import { Box, Center, Link, VStack } from '@chakra-ui/layout';
import { Collapse, Icon, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { IoLogoDiscord, IoLogoTwitter, IoMenuOutline } from 'react-icons/io5';

export default function Sidebar() {
  const ref = useRef(null);
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 992px)');

  const { isOpen, onToggle, onClose, onOpen } = useDisclosure({
    defaultIsOpen: !isMobile,
  });

  const [toggleOnScroll, setToggleOnScroll] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 80) {
        onClose();
      } else if (!isMobile && toggleOnScroll) {
        onOpen();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, onClose, onOpen, toggleOnScroll]);

  return (
    <Box
      ref={ref}
      zIndex="9999"
      position="fixed"
      left="0"
      top={{ base: 44, lg: 6 }}
      maxW={isOpen ? '120px' : '64px'}
      _hover={
        !isOpen
          ? {
              cursor: 'pointer',
              shadow: '2xl',
            }
          : {}
      }
      onClick={() => {
        if (!isOpen) {
          setToggleOnScroll(true);
          onOpen();
        }
      }}
      p="4"
      bg="white"
      shadow="lg"
      roundedRight="3xl"
      transitionProperty="width,box-shadow"
      transitionDuration="normal"
    >
      {(!isOpen || isMobile) && (
        <Center>
          <Icon
            as={IoMenuOutline}
            boxSize={8}
            color="purple.500"
            mx="auto"
            cursor="pointer"
            onClick={() => {
              setToggleOnScroll(false);
              onToggle();
            }}
          />
        </Center>
      )}
      <Collapse in={isOpen} animateOpacity>
        <VStack spacing="8" mt={isMobile ? 4 : 0}>
          <Link href="https://www.credmark.com/" isExternal>
            <Img src="/img/logo.svg" h="8" />
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
            <NextLink href="/info" passHref>
              <Link
                fontFamily="Credmark Regular"
                fontSize="sm"
                textAlign="center"
                color={router.pathname === '/info' ? 'pink.500' : 'purple.500'}
                lineHeight="1"
              >
                ANALYTICS
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
            <Box bg="purple.500" w="16px" h="2px"></Box>
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
