import {
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Grid,
  GridItem,
  useBreakpointValue,
  useDisclosure,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';

import usePrevious from '~/hooks/usePrevious';
import { useSidebarVisibility } from '~/state/application/hooks';

import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type SidebarDrawerProps = UseDisclosureReturn;

const sidebarItems = [
  {
    label: 'Financial Metrics',
    subNav: [
      { label: 'Protocol Analytics', isDisabled: true },
      { label: 'Sharpe Ratio', href: '/terminal/sharpe' },
    ],
  },

  // {
  //   label: 'Stablecoin Health',
  //   subNav: [
  //     {
  //       label: 'FRAX Stats & Collateralization',
  //       href: '/terminal/stablecoin/frax-stats',
  //     },
  //     {
  //       label: 'FRAX Balances & Holders',
  //       href: '/terminal/stablecoin/frax-balances',
  //     },
  //     {
  //       label: 'FRAX Liquidity by Platform',
  //       href: '/terminal/stablecoin/frax-liquidity',
  //     },
  //   ],
  // },

  {
    label: 'Lenders',
    subNav: [
      { label: 'Lenders', href: '/terminal/lenders' },
      { label: 'Lending Usage AAVE', href: '/terminal/lenders/aave-usage' },
      {
        label: 'Lending Usage Compound',
        href: '/terminal/lenders/compound-usage',
      },
    ],
  },

  {
    label: 'DEXs',
    subNav: [
      { label: 'Uniswap V2', href: '/terminal/dex/uniswap-v2' },
      { label: 'Uniswap V3', href: '/terminal/dex/uniswap-v3' },
      { label: 'Curve', href: '/terminal/dex/curve' },
      { label: 'Sushiswap', href: '/terminal/dex/sushi' },
    ],
  },

  {
    label: 'Credmark Analytics',
    subNav: [
      { label: 'Token Analytics', href: '/info' },
      { label: 'Model Overview', href: '/models' },
      { label: 'Model Runner', href: '/models/run' },
      { label: 'Model Usage', href: '/models/usage' },
    ],
  },
];

function SidebarDrawer({ isOpen, onClose }: SidebarDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      returnFocusOnClose={false}
      onOverlayClick={onClose}
    >
      <DrawerOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
      <DrawerContent>
        <Sidebar fixedWidth={80} items={sidebarItems} />
        <CloseButton
          top="1"
          right="2"
          position="absolute"
          onClick={onClose}
          colorScheme="whiteAlpha"
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
          size="sm"
        />
      </DrawerContent>
    </Drawer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const mobileSidebar = useDisclosure();
  const isSidebarVisible = useSidebarVisibility();

  const prevRoute = usePrevious(router.pathname);

  const isMobile = useBreakpointValue<boolean>({ base: true, lg: false });

  useEffect(() => {
    if (!isMobile) mobileSidebar.onClose();
  }, [isMobile, mobileSidebar]);

  useEffect(() => {
    if (prevRoute !== router.pathname) {
      mobileSidebar.onClose();
    }
  }, [mobileSidebar, prevRoute, router.pathname]);

  const activeItem = useMemo(() => {
    const subtitle = sidebarItems.find((item) =>
      item.subNav.some(({ href }) => href && href === router.pathname),
    )?.label;

    const title = sidebarItems
      .map((item) => item.subNav)
      .flat()
      .find(({ href }) => href && href === router.pathname)?.label;

    return { title, subtitle };
  }, [router.pathname]);

  return (
    <>
      <Grid
        gap={0}
        minH="100vh"
        bg="gray.50"
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
          "sidebar navbar"  
          "sidebar content"
          "sidebar footer"
        `
            : undefined,
        }}
      >
        <GridItem gridArea="navbar">
          <Navbar
            mobileSidebar={mobileSidebar}
            title={activeItem.title}
            subtitle={activeItem.subtitle}
          />
        </GridItem>

        {isSidebarVisible && (
          <GridItem gridArea="sidebar" display={{ base: 'none', lg: 'block' }}>
            <Sidebar fixedWidth={72} items={sidebarItems} />
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
