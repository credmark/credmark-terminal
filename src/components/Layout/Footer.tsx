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
            href="https://discord.com/invite/3dSfMqP3d4"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={IoLogoDiscord} />
          </Link>
          <Link
            href="https://t.me/credmark"
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
            href="https://www.youtube.com/channel/UCdmImsISNfkXTxJPkmCnVNg"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={IoLogoYoutube} />
          </Link>
          <Link
            href="https://www.reddit.com/r/Credmark"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={BsReddit} />
          </Link>
          <Link
            href="https://github.com/credmark"
            isExternal
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            <Icon as={BsGithub} />
          </Link>
          <Link
            href="https://blog.credmark.com"
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
          <Link href={'https://docs.credmark.com/credmark'} isExternal>
            White Paper
          </Link>
          <Link href={'https://docs.credmark.com/'} isExternal>
            Credmark Library
          </Link>
          <Link href={'https://credmark.com/reports'} isExternal>
            Reports
          </Link>
          <Link href={'https://app.credmark.com'} isExternal>
            Credmark Terminal
          </Link>
        </Stack>
        <Stack align={'flex-start'} spacing="4">
          <ListHeader>Learn</ListHeader>
          <Link href={'https://credmark.com/blog'} isExternal>
            Blog
          </Link>
          <Link href={'https://credmark.com/media'} isExternal>
            Media
          </Link>
          <Link href={'https://credmark.com/faq'} isExternal>
            FAQ
          </Link>
        </Stack>
        <Stack align={'flex-start'} spacing="4">
          <ListHeader>Community</ListHeader>
          <Link href={'https://credmark.com/contributors'} isExternal>
            Contributors
          </Link>
          <Link href={'https://credmark.com/careers'} isExternal>
            Work with us
          </Link>
          <Link href={'https://discord.com/invite/3dSfMqP3d4'} isExternal>
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
