import {
  Drawer as CDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
} from '@chakra-ui/react';
import React, { FC } from 'react';
interface LeftSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeftSideDrawer: FC<LeftSideDrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <>
      <CDrawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody p={0}>{children}</DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </CDrawer>
    </>
  );
};
export default LeftSideDrawer;
