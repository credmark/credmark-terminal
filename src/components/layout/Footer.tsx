import {
  Box,
  Stack,
  SimpleGrid,
  Link,
  Text,
  Img,
  HStack,
  Icon,
  useColorMode,
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
  const { colorMode } = useColorMode();

  return (
    <Stack
      bg={colorMode === 'dark' ? '#161216' : 'purple.900'}
      color="white"
      w="100%"
      direction={{ base: 'column', md: 'row' }}
      px="16"
      pt="8"
      pb="16"
    >
      <Stack spacing={4} flex="1">
        <Box>
          <Img src="/img/logo-white-full.svg" alt="Credmark" h="60px" />
        </Box>
        <HStack spacing={4}>
          <Link
            href="https://discord.com/invite/3dSfMqP3d4"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
            aria-label="Credmark on Discord"
            rel="noopener"
          >
            <Icon as={IoLogoDiscord} />
          </Link>
          <Link
            href="https://t.me/credmark"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
            aria-label="Credmark on Telegram"
            rel="noopener"
          >
            <Icon as={FaTelegramPlane} />
          </Link>
          <Link
            href="https://twitter.com/credmarkhq"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
            aria-label="Credmark on Twitter"
            rel="noopener"
          >
            <Icon as={IoLogoTwitter} />
          </Link>
          <Link
            href="https://www.youtube.com/channel/UCdmImsISNfkXTxJPkmCnVNg"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
            aria-label="Credmark on Youtube"
            rel="noopener"
          >
            <Icon as={IoLogoYoutube} />
          </Link>
          <Link
            href="https://www.reddit.com/r/Credmark"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
            aria-label="Credmark on Reddit"
            rel="noopener"
          >
            <Icon as={BsReddit} />
          </Link>
          <Link
            href="https://github.com/credmark"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
            aria-label="Credmark on Github"
            rel="noopener"
          >
            <Icon as={BsGithub} />
          </Link>
          <Link
            href="https://blog.credmark.com"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
            aria-label="Blog"
            rel="noopener"
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
          <Link
            href={'https://docs.credmark.com/credmark'}
            isExternal
            aria-label="White Paper"
          >
            White Paper
          </Link>
          <Link
            href={'https://docs.credmark.com/'}
            isExternal
            aria-label="Credmark Library"
          >
            Credmark Library
          </Link>
          <Link
            href={'https://credmark.com/reports'}
            isExternal
            aria-label="Reports"
          >
            Reports
          </Link>
          <Link
            href={'https://app.credmark.com'}
            isExternal
            aria-label="Credmark Terminal"
          >
            Credmark Terminal
          </Link>
        </Stack>
        <Stack align={'flex-start'} spacing="4">
          <ListHeader>Learn</ListHeader>
          <Link
            href={'https://credmark.com/blog'}
            isExternal
            aria-label="Credmark Blog"
          >
            Blog
          </Link>
          <Link
            href={'https://credmark.com/media'}
            isExternal
            aria-label="Media"
          >
            Media
          </Link>
          <Link href={'https://credmark.com/faq'} isExternal aria-label="FAQ">
            FAQ
          </Link>
        </Stack>
        <Stack align={'flex-start'} spacing="4">
          <ListHeader>Community</ListHeader>
          <Link
            href={'https://credmark.com/contributors'}
            isExternal
            aria-label="Contributors"
          >
            Contributors
          </Link>
          <Link
            href={'https://credmark.com/careers'}
            isExternal
            aria-label="Work with us"
          >
            Work with us
          </Link>
          <Link
            href={'https://discord.com/invite/3dSfMqP3d4'}
            isExternal
            aria-label="Discord"
          >
            Our Discord
          </Link>
        </Stack>
        <Stack align={'flex-start'} spacing="4">
          <ListHeader>Languages</ListHeader>
          <Link href={'#'}>English</Link>
          {/* <Link href={'#'}>简体中文</Link>
          <Link href={'#'}>简体中文</Link> */}
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
