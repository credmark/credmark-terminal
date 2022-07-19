import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  HStack,
  Icon,
  Img,
  Link,
  Tag,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PerfectScrollbar from 'perfect-scrollbar';
import React, { useEffect, useMemo, useRef } from 'react';
import { BsFillCaretRightFill } from 'react-icons/bs';

import env from '~/env';

import Web3Status from './Web3Status';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

interface NavItemProps {
  label: string;
  isDisabled?: boolean;
  href?: string;
  isExternal?: boolean;
}

function NavItem({
  label,
  isDisabled = false,
  href,
  isExternal,
}: NavItemProps) {
  const router = useRouter();
  const isActive = !isDisabled && href && router.pathname === href;

  const inner = (
    <HStack
      justify="flex-start"
      px="4"
      py="3"
      bg={isActive ? 'green.500' : undefined}
      color={isActive ? 'black' : isDisabled ? 'whiteAlpha.500' : 'white'}
      cursor={isActive || isDisabled ? undefined : 'pointer'}
      borderColor="green.500"
      transitionDuration="normal"
      transitionProperty="common"
      _hover={
        isActive || isDisabled
          ? {}
          : {
              bg: 'green.500',
              color: 'black',
            }
      }
    >
      <Text flex="1" fontWeight={400} fontSize="md">
        {label}
      </Text>
    </HStack>
  );

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
  items: Array<{ label: string; subNav: NavItemProps[] }>;
  fixedWidth: number;
}

export default function Sidebar({
  fixedWidth,
  items,
  ...boxProps
}: SidebarProps) {
  const router = useRouter();
  const accordionRef = useRef(null);
  const { colorMode } = useColorMode();

  const defaultIndex = useMemo(() => {
    return items
      .map((item, index) => ({ ...item, index }))
      .filter((item) =>
        item.subNav.some(({ href }) => href && href === router.pathname),
      )
      .map((item) => item.index);
  }, [items, router.pathname]);

  useEffect(() => {
    if (accordionRef.current) new PerfectScrollbar(accordionRef.current);
  }, []);

  return (
    <Box
      w={fixedWidth}
      minW={fixedWidth}
      h="100vh"
      bg={colorMode === 'dark' ? '#1C161F' : 'purple.800'}
      color="white"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      position="sticky"
      top="0"
      {...boxProps}
    >
      <HStack px="4" py="2" mt="2">
        <NextLink href="/" passHref>
          <Link aria-label="www.credmark.com">
            <Img src="/img/logo-white-full.svg" alt="Credmark" h="14" />
          </Link>
        </NextLink>
        {env.isBeta && (
          <Tag size="sm" bg="green.500" color="purple.800" py="1" fontSize="sm">
            Beta
          </Tag>
        )}
      </HStack>
      <Accordion
        ref={accordionRef}
        allowMultiple
        defaultIndex={defaultIndex}
        position="relative"
        flex="1"
        overflowY="hidden"
      >
        {items.map(({ label, subNav }) => (
          <AccordionItem border="none" key={label} my="2">
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton
                    color="green.500"
                    fontSize="sm"
                    fontWeight={900}
                    textTransform="uppercase"
                  >
                    <Box flex="1" textAlign="left">
                      {label}
                    </Box>
                    <Icon
                      as={BsFillCaretRightFill}
                      boxSize="4"
                      transform={isExpanded ? 'rotate(90deg)' : 'rotate(0)'}
                      transitionProperty="transform"
                      transitionDuration="normal"
                    />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack align="stretch">
                    {subNav.map((navItem, index) => (
                      <NavItem key={`${label}_${index}`} {...navItem} />
                    ))}
                  </VStack>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>
      <VStack
        bg={colorMode === 'dark' ? '#161216' : 'purple.900'}
        py="6"
        borderTop="1px"
        borderColor="whiteAlpha.100"
        spacing="4"
      >
        <Web3Status />
        <NextLink href="/stake" passHref>
          <Link>Stake CMK</Link>
        </NextLink>
      </VStack>
    </Box>
  );
}
