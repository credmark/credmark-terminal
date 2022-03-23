import {
  Box,
  Flex,
  Stack,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';

import Footer from '~/components/Layout/Footer/Footer';
import Navigation from '~/components/Layout/Navigation/Navigation';

import LeftSideDrawer from '../LeftSideDrawer';

import UserSideBar from './UserSideBar';

interface DashboardLayoutProps {
  children: ReactNode;
  text: string;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const [isLessThan786] = useMediaQuery('(max-width: 786px)');
  return (
    <>
      <Navigation onToggle={onToggle} />
      <Flex>
        {isLessThan786 ? (
          <LeftSideDrawer onClose={onClose} isOpen={isOpen}>
            <UserSideBar isDrawer />
          </LeftSideDrawer>
        ) : (
          <>
            {isOpen && (
              <Box w="250px">
                <UserSideBar />
              </Box>
            )}
          </>
        )}

        <Box flex="1">
          <Stack>
            <Box marginTop={0}> {children}</Box>
            <Footer />
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default DashboardLayout;
