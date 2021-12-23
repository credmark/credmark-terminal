import {
  Box,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface StatContainerProps {
  title: string;
  helpText?: React.ReactNode;
  children: React.ReactNode;
}

export default function StatContainer({
  title,
  helpText,
  children,
}: StatContainerProps) {
  return (
    <Box>
      <HStack
        position="relative"
        mx="auto"
        mt="12"
        pt="1"
        pb="1"
        bg="white"
        shadow="lg"
        rounded="lg"
        w="400px"
        zIndex="2"
        justify="center"
      >
        <Text
          fontFamily="Credmark Regular"
          pt="1"
          textAlign="center"
          lineHeight="1.2"
          fontSize="xl"
          color="purple.500"
        >
          {title}
        </Text>
        {helpText && (
          <Popover placement="top-end" gutter={16} flip={false}>
            <PopoverTrigger>
              <Box>
                <Icon
                  as={IoInformationCircleOutline}
                  boxSize="20px"
                  cursor="pointer"
                  color="purple.500"
                  transitionDuration="normal"
                  transitionProperty="transform"
                  _active={{
                    transform: 'scale(0.98)',
                  }}
                />
              </Box>
            </PopoverTrigger>
            <PopoverContent
              color="purple.500"
              bg="white"
              borderColor="purple.500"
            >
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
              <PopoverBody p="4">{helpText}</PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </HStack>
      <Box
        position="relative"
        bg="gray.50"
        py="8"
        mt="-4"
        zIndex="1"
        rounded="md"
      >
        {children}
      </Box>
    </Box>
  );
}
