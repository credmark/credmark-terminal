import {
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Switch,
  useColorMode,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import React from 'react';
import { BsList } from 'react-icons/bs';

interface NavbarProps {
  title?: string;
  subtitle?: string;
  mobileSidebar: UseDisclosureReturn;
}

export default function Navbar({
  title,
  subtitle,
  mobileSidebar,
}: NavbarProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <HStack px="6" pt="6" pb="2">
        <IconButton
          variant="link"
          colorScheme="green"
          display={{ lg: 'none' }}
          aria-label="Menu"
          icon={<Icon as={BsList} boxSize="8" />}
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
        {title && (
          <Box>
            <Heading
              as="h2"
              fontSize="sm"
              fontWeight={300}
              textTransform="uppercase"
            >
              {subtitle}
            </Heading>
            <Heading as="h1" fontSize="2xl" fontWeight={700}>
              {title}
            </Heading>
          </Box>
        )}
        <Spacer />
        <Switch
          isChecked={colorMode === 'dark'}
          onChange={toggleColorMode}
          colorScheme={colorMode === 'dark' ? 'green' : 'purple'}
        />
      </HStack>
    </Box>
  );
}
