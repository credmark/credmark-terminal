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
  useBreakpointValue,
  useDisclosure,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

import { useSidebarVisibility } from '~/state/application/hooks';

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
  const isSidebarVisible = useSidebarVisibility();

  const isMobile = useBreakpointValue<boolean>({ base: true, lg: false });

  useEffect(() => {
    if (!isMobile) mobileSidebar.onClose();
  }, [isMobile, mobileSidebar]);

  return (
    <>
      <Grid
        minH="100vh"
        spacing="0"
        bg="#F8F8F9"
        maxW="100vw"
        templateColumns={{
          base: '1fr',
          lg: isSidebarVisible ? '288px 1fr' : '1fr',
        }}
        templateRows="min-content 1fr min-content"
        templateAreas={{
          base: `
          "navbar"
          "content"
          "footer"
        `,
          lg: isSidebarVisible
            ? `
          "navbar navbar"
          "sidebar content"
          "sidebar footer"
        `
            : `
            "navbar"
            "content"
            "footer"
          `,
        }}
      >
        <GridItem gridArea="navbar">
          <Navbar mobileSidebar={mobileSidebar} />
        </GridItem>

        {isSidebarVisible && (
          <GridItem gridArea="sidebar" display={{ base: 'none', lg: 'block' }}>
            <Sidebar fixedWidth={72} />
          </GridItem>
        )}

        <GridItem gridArea="content" minW="0">
          {children}
        </GridItem>

        <GridItem gridArea="footer">
          <Footer />
        </GridItem>
      </Grid>

      {isSidebarVisible && <SidebarDrawer {...mobileSidebar} />}
    </>
  );
}
