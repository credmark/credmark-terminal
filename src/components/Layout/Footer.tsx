import {
  Box,
  Stack,
  SimpleGrid,
  Link,
  Text,
  Img,
  HStack,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { BsGithub, BsMedium, BsReddit } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';
import { IoLogoDiscord, IoLogoTwitter, IoLogoYoutube } from 'react-icons/io5';

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Stack
      bg="purple.500"
      color="white"
      w="100%"
      // w="100vw"
      direction={{ base: 'column', md: 'row' }}
      px="16"
      pt="8"
      pb="16"
    >
      <Stack spacing={4} flex="1">
        <Box>
          <Img src="/img/logo-white-full.svg" h="60px" />
        </Box>
        <HStack spacing={4}>
          <Link
            href="https://discord.com/invite/BJbYSRDdtr"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={IoLogoDiscord} />
          </Link>
          <Link
            href="https://discord.com/invite/BJbYSRDdtr"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={FaTelegramPlane} />
          </Link>
          <Link
            href="https://twitter.com/credmarkhq"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={IoLogoTwitter} />
          </Link>
          <Link
            href="https://discord.com/invite/BJbYSRDdtr"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={IoLogoYoutube} />
          </Link>
          <Link
            href="https://discord.com/invite/BJbYSRDdtr"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={BsReddit} />
          </Link>
          <Link
            href="https://discord.com/invite/BJbYSRDdtr"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={BsGithub} />
          </Link>
          <Link
            href="https://discord.com/invite/BJbYSRDdtr"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={BsMedium} />
          </Link>
        </HStack>
      </Stack>
      <SimpleGrid
        templateColumns={{ sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }}
        spacing={8}
      >
        <Stack align={'flex-start'} spacing="4">
          <ListHeader>Projects</ListHeader>
          <Link href={'#'}>White Paper</Link>
          <Link href={'#'}>Credmark Wiki</Link>
          <Link href={'#'}>Reports</Link>
          <Link href={'#'}>Risk Terminal</Link>
        </Stack>
        <Stack align={'flex-start'} spacing="4">
          <ListHeader>Learn</ListHeader>
          <Link href={'#'}>Blog</Link>
          <Link href={'#'}>Media</Link>
          <Link href={'#'}>FAQ</Link>
        </Stack>
        <Stack align={'flex-start'} spacing="4">
          <ListHeader>Community</ListHeader>
          <Link href={'#'}>Contributors</Link>
          <Link href={'#'}>Work with us</Link>
          <Link href={'#'}>Our Discord</Link>
        </Stack>
        <Stack align={'flex-start'} spacing="4">
          <ListHeader>Languages</ListHeader>
          <Link href={'#'}>English</Link>
          <Link href={'#'}>简体中文</Link>
          <Link href={'#'}>简体中文</Link>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
