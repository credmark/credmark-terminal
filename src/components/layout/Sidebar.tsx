import {
  Box,
  HStack,
  Icon,
  VStack,
  Text,
  Link,
  BoxProps,
} from '@chakra-ui/react';
import { SvgIconComponent } from '@mui/icons-material';
import ApiIcon from '@mui/icons-material/Api';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CodeIcon from '@mui/icons-material/Code';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { CmkTerminalIcon } from '~/components/icons';

interface NavItemProps extends BoxProps {
  icon?: typeof Icon | SvgIconComponent;
  label: string;
  isHeader?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  href?: string;
  isExternal?: boolean;
  onClick?: () => void;

  backIcon?: boolean;
  forwardIcon?: boolean;

  subNav?: Array<NavItemProps>;
}

function NavItem({
  icon,
  label,
  isHeader = false,
  isFocused = false,
  isDisabled = false,
  href,
  isExternal,
  onClick,
  backIcon,
  forwardIcon,
  subNav,

  ...boxProps
}: NavItemProps) {
  const router = useRouter();
  const isActive = href && router.pathname === href;

  if (isHeader) {
    return (
      <Text
        pt="4"
        pb="2"
        color="purple.500"
        fontSize="sm"
        textTransform="uppercase"
        fontWeight="bold"
      >
        {label}
      </Text>
    );
  }

  const inner = (
    <HStack
      onClick={onClick}
      justify="flex-start"
      px="4"
      py="3"
      rounded="md"
      bg={isActive ? 'green.500' : undefined}
      color={isDisabled ? 'gray.300' : 'black'}
      cursor={isActive || (subNav && subNav.length) ? undefined : 'pointer'}
      borderColor="green.500"
      borderWidth={isFocused ? '1px' : 0}
      transitionDuration="normal"
      transitionProperty="common"
      _hover={
        isActive || (subNav && subNav.length)
          ? {}
          : {
              bg: 'green.50',
            }
      }
      {...boxProps}
    >
      {backIcon && <Icon as={ArrowLeftIcon} />}
      {icon && (
        <Icon
          as={icon}
          boxSize="5"
          color={isDisabled ? 'gray.300' : 'purple.500'}
        />
      )}
      <Text flex="1">{label}</Text>
      {forwardIcon && <Icon as={ArrowRightIcon} />}
      {subNav && subNav.length > 0 && <Icon as={KeyboardArrowDownIcon} />}
    </HStack>
  );

  if (subNav && subNav.length > 0) {
    return (
      <VStack alignItems="stretch">
        {inner}
        {subNav.map((child) => (
          <Box key={child.label} pl="4">
            <NavItem {...child} />
          </Box>
        ))}
      </VStack>
    );
  }

  if (href && isExternal) {
    return (
      <Link _hover={{ textDecoration: 'none' }} href={href} isExternal>
        {inner}
      </Link>
    );
  }

  if (href && !isExternal) {
    return (
      <NextLink href={href} passHref>
        <Link _hover={{ textDecoration: 'none' }}>{inner}</Link>
      </NextLink>
    );
  }

  return inner;
}

interface SidebarProps extends BoxProps {
  fixedWidth: number;
}

export default function Sidebar({ fixedWidth, ...boxProps }: SidebarProps) {
  const router = useRouter();

  const homeItems = useMemo<NavItemProps[]>(
    () => [
      { icon: HomeOutlinedIcon, label: 'Home', href: '/' },
      {
        icon: CmkTerminalIcon,
        label: 'Credmark Terminal',
        isFocused: router.pathname.startsWith('/terminal'),
        onClick: () => setShowTerminalItems(true),
        forwardIcon: true,
      },
      {
        icon: ApiIcon,
        label: 'API Access',
        href: 'https://gateway.credmark.com/api',
        isExternal: true,
      },
      {
        icon: CodeIcon,
        label: 'Model Framework',
        href: 'https://github.com/credmark/credmark-models-py',
        isExternal: true,
      },
      {
        icon: VerifiedOutlinedIcon,
        label: 'Model Validation',
        isDisabled: true,
      },
    ],
    [router.pathname],
  );

  const terminalItems: NavItemProps[] = useMemo(
    () => [
      {
        icon: HomeOutlinedIcon,
        label: 'Home',
        onClick: () => setShowTerminalItems(false),
        backIcon: true,
      },

      { label: 'Financial Metrics', isHeader: true },
      { label: 'Protocol Analytics', isDisabled: true },
      { label: 'Sharpe Ratio', href: '/terminal/sharpe' },

      { label: 'Lenders', isHeader: true },
      { label: 'Lenders', href: '/terminal/lenders' },
      { label: 'Lending Usage AAVE', href: '/terminal/lenders/aave-usage' },
      {
        label: 'Lending Usage Compound',
        href: '/terminal/lenders/compound-usage',
      },

      {
        label: 'DEXs',
        isHeader: true,
        isFocused: router.pathname.startsWith('/terminal/dex'),
      },
      { label: 'Uniswap V2', href: '/terminal/dex/uniswap-v2' },
      { label: 'Uniswap V3', href: '/terminal/dex/uniswap-v3' },
      { label: 'Curve', href: '/terminal/dex/curve' },
      { label: 'Sushiswap', href: '/terminal/dex/sushi' },

      { label: 'Credmark Analytics', isHeader: true },
      { label: 'Token Analytics', href: '/info' },
      { label: 'Model Usage', href: '/models/usage' },
    ],
    [router.pathname],
  );

  const terminalLinks: string[] = useMemo(() => {
    function getLinks(items: NavItemProps[]): string[] {
      const links: string[] = [];
      for (const item of items) {
        if (item.href) {
          links.push(item.href);
        }

        if (Array.isArray(item.subNav)) {
          links.push(...getLinks(item.subNav));
        }
      }

      return links;
    }

    return getLinks(terminalItems);
  }, [terminalItems]);

  const [showTerminalItems, setShowTerminalItems] = useState(
    terminalLinks.includes(router.pathname),
  );

  useEffect(() => {
    if (terminalLinks.includes(router.pathname)) {
      setShowTerminalItems(true);
    }
  }, [router.pathname, terminalLinks]);

  return (
    <Box
      w={fixedWidth}
      minW={fixedWidth}
      minH="100vh"
      h="100%"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      position="relative"
      overflow="hidden"
      {...boxProps}
    >
      <VStack
        align="stretch"
        spacing="2"
        position="absolute"
        top="0"
        left={showTerminalItems ? -fixedWidth : 0}
        w="100%"
        bottom="0"
        pt="6"
        px="4"
        transitionProperty="left"
        transitionDuration="normal"
      >
        {homeItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </VStack>
      <VStack
        align="stretch"
        spacing="1"
        position="absolute"
        top="0"
        left={showTerminalItems ? 0 : fixedWidth}
        w="100%"
        bottom="0"
        pt="6"
        px="4"
        transitionProperty="left"
        transitionDuration="normal"
      >
        {terminalItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </VStack>
    </Box>
  );
}
