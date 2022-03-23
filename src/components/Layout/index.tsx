import {
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Grid,
  GridItem,
  HStack,
  Img,
  Link,
  useDisclosure,
  UseDisclosureReturn,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type SidebarDrawerProps = UseDisclosureReturn;

function SidebarDrawer({ isOpen, onClose }: SidebarDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      returnFocusOnClose={false}
      onOverlayClick={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <HStack w="100%" bg="purple.500" px={{ base: 4, md: 8 }} py="2">
          <Link href="https://www.credmark.com/" isExternal>
            <Img src="/img/logo-white-full.svg" h="40px" />
          </Link>
          <Box flex="1"></Box>
          <CloseButton
            onClick={onClose}
            colorScheme="whiteAlpha"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
          />
        </HStack>
        <Sidebar fixedWidth={80} />
      </DrawerContent>
    </Drawer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const mobileSidebar = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 992px)');

  useEffect(() => {
    if (!isMobile) mobileSidebar.onClose();
  }, [isMobile, mobileSidebar]);

  return (
    <>
      <Grid
        minH="100vh"
        spacing="0"
        bg="#E5E5E5"
        maxW="100vw"
        templateColumns={{ base: '1fr', md: '240px 1fr' }}
        templateRows="min-content 1fr min-content"
        templateAreas={{
          base: `
          "navbar"
          "content"
          "footer"
        `,
          md: `
          "navbar navbar"
          "sidebar content"
          "sidebar footer"
        `,
        }}
      >
        <GridItem gridArea="navbar">
          <Navbar mobileSidebar={mobileSidebar} />
        </GridItem>

        <GridItem gridArea="sidebar" display={{ base: 'none', md: 'block' }}>
          <Sidebar fixedWidth={60} />
        </GridItem>

        <GridItem gridArea="content">{children}</GridItem>

        <GridItem gridArea="footer">
          <Footer />
        </GridItem>
      </Grid>
      <SidebarDrawer {...mobileSidebar} />
    </>
  );
}
