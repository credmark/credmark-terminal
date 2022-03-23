import { Box, Button, Container, Flex, HStack, Icon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { IoMenu } from 'react-icons/io5';

import Logo from '~/components/Logo/Logo';
interface NavbarProps {
  routes: {
    name: string;
    link: string;
  }[];
  onToggle: () => void;
}

const Navbar: FC<NavbarProps> = ({ routes, onToggle }) => {
  return (
    <Box as="nav" bg="purple.500" color="white">
      <Container
        h="70px"
        maxW="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Brand */}
        <HStack>
          <Icon
            onClick={onToggle}
            boxSize="30px"
            justifyContent="center"
            aria-label="drawer-btn"
            fontSize="xl"
          >
            <IoMenu />
          </Icon>
          <Logo />
        </HStack>

        <HStack spacing="4" display={{ base: 'none', md: 'flex' }}>
          <Flex gap="4">
            {routes.map((route) => (
              <Box
                borderBottom="2px solid transparent"
                _hover={{
                  borderBottom: '2px solid white',
                }}
                fontSize="md"
                key={route.name}
              >
                {route.name}
              </Box>
            ))}
          </Flex>
          <Button
            color="white"
            borderColor="white"
            variant="outline"
            borderRadius="full"
            _hover={{ color: 'black', bg: 'white' }}
          >
            0xcCB6812d853EC
          </Button>
        </HStack>
      </Container>
    </Box>
  );
};
export default Navbar;
