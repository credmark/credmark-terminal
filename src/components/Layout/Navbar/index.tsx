import {
  Link,
  HStack,
  Img,
  Box,
  Collapse,
  useDisclosure,
  Icon,
  IconButton,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { IoChevronDown, IoChevronUp, IoMenuSharp } from 'react-icons/io5';

import Web3Status from './Web3Status';

interface NavbarProps {
  mobileSidebar: UseDisclosureReturn;
}
export default function Navbar({ mobileSidebar }: NavbarProps) {
  const mobileNav = useDisclosure();

  return (
    <Box>
      <HStack bg="purple.500" px={{ base: 4, md: 8 }} py="2">
        <IconButton
          variant="unstyled"
          colorScheme="whiteAlpha"
          color="white"
          display={{ md: 'none' }}
          size="sm"
          aria-label="Menu"
          fontSize="2xl"
          icon={<Icon as={IoMenuSharp} />}
          onClick={mobileSidebar.onToggle}
          _hover={{
            transform: 'translateY(-1px)',
            shadow: 'lg',
          }}
          _active={{
            transform: 'scale(0.98)',
            boxShadow: 'inner',
          }}
        />
        <Link href="https://www.credmark.com/" isExternal>
          <Img src="/img/logo-white-full.svg" h="40px" />
        </Link>
        <Box flex="1"></Box>
        <HStack spacing="4" display={{ base: 'none', md: 'flex' }}>
          <NextLink href="/info">
            <Link color="white">Analytics</Link>
          </NextLink>

          <Link
            color="white"
            href="https://docs.credmark.com/credmark-wiki"
            isExternal
          >
            Credmark Wiki
          </Link>

          <Web3Status />
        </HStack>
        <IconButton
          variant="unstyled"
          colorScheme="whiteAlpha"
          color="white"
          display={{ md: 'none' }}
          size="sm"
          aria-label="More items"
          fontSize="2xl"
          icon={
            mobileNav.isOpen ? (
              <Icon as={IoChevronUp} />
            ) : (
              <Icon as={IoChevronDown} />
            )
          }
          onClick={mobileNav.onToggle}
          _hover={{
            transform: 'translateY(-1px)',
            shadow: 'lg',
          }}
          _active={{
            transform: 'scale(0.98)',
            boxShadow: 'inner',
          }}
        />
      </HStack>
      <Collapse in={mobileNav.isOpen} animateOpacity>
        <HStack
          spacing="4"
          display={{ base: 'flex', md: 'none' }}
          bg="purple.500"
          py="2"
          justify="center"
        >
          <NextLink href="/info">
            <Link color="white">Analytics</Link>
          </NextLink>

          <NextLink href="/terminal">
            <Link color="white">Risk Library</Link>
          </NextLink>

          <Web3Status />
        </HStack>
      </Collapse>
    </Box>
  );
}
