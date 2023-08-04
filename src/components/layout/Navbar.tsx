import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Img,
  Spacer,
  Switch,
  useColorMode,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import React from 'react';
import { BsList } from 'react-icons/bs';

interface NavbarProps {
  logo?: string;
  title?: string;
  subtitle?: string;
  mobileSidebar: UseDisclosureReturn;
}

export default function Navbar({
  logo,
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
        {logo && (
          <Box pr="2">
            <Img src={logo} bg="gray.800" />
          </Box>
        )}
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
        <FormControl display="flex" alignItems="center" w="unset">
          <FormLabel htmlFor="color-mode-toggle" mb="0" fontWeight={300}>
            Dark Mode
          </FormLabel>
          <Switch
            variant={colorMode === 'dark' ? 'darkMode' : 'lightMode'}
            id="color-mode-toggle"
            isChecked={colorMode === 'dark'}
            onChange={toggleColorMode}
          />
        </FormControl>
      </HStack>
    </Box>
  );
}
