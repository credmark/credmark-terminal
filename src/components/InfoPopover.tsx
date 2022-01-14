import {
  Center,
  Icon,
  IconProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface InfoPopoverProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  triggerIconProps?: IconProps;
}

export default function InfoPopover({
  children,
  trigger,
  triggerIconProps = {},
}: InfoPopoverProps) {
  const defaultTrigger = (
    <Center>
      <Icon
        as={IoInformationCircleOutline}
        cursor="pointer"
        transitionDuration="normal"
        transitionProperty="transform"
        _active={{
          transform: 'scale(0.98)',
        }}
        {...triggerIconProps}
      />
    </Center>
  );
  return (
    <Popover placement="top-start" gutter={16} flip={false}>
      <PopoverTrigger>{trigger ?? defaultTrigger}</PopoverTrigger>
      <PopoverContent color="purple.500" bg="white" borderColor="purple.500">
        <PopoverArrow
          borderColor="purple.500"
          borderRight="1px"
          borderBottom="1px"
        />
        <PopoverCloseButton
          top="-2"
          right="-2"
          bg="purple.500"
          color="white"
          rounded="full"
          _hover={{
            bg: 'purple.500',
            transform: 'translateY(-2px)',
            shadow: 'lg',
          }}
          _active={{
            transform: 'scale(0.98)',
            boxShadow: 'inner',
          }}
        />
        <PopoverBody p="4">{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
