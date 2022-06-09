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
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';

interface StatusPopoverProps {
  children: React.ReactNode;
  iconProps?: IconProps;
  status?: 'info' | 'error';
}

export default function StatusPopover({
  children,
  iconProps = {},
  status = 'info',
}: StatusPopoverProps) {
  const color = { info: 'purple.500', error: 'red.500' }[status];
  const icon = { info: InfoIcon, error: ErrorIcon }[status];

  return (
    <Popover placement="bottom-start" offset={[-10, 8]} flip={false}>
      <PopoverTrigger>
        <Center>
          <Icon
            as={icon}
            color={color}
            cursor="pointer"
            transitionDuration="normal"
            transitionProperty="transform"
            _active={{
              transform: 'scale(0.98)',
            }}
            {...iconProps}
          />
        </Center>
      </PopoverTrigger>
      <PopoverContent color={color} bg="white" borderColor={color}>
        <PopoverArrow
          borderColor={color}
          borderLeft="1px"
          borderTop="1px"
          boxShadow="none !important"
        />
        <PopoverCloseButton
          top="-2"
          right="-2"
          bg={color}
          color="white"
          rounded="full"
          _hover={{
            bg: color,
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
