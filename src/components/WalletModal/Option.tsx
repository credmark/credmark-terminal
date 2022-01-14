import { Button, Flex, Text, Center, Image, Link, Box } from '@chakra-ui/react';
import React from 'react';

interface OptionProps {
  link?: string | null;
  clickable?: boolean;
  size?: number | null;
  onClick?: null | (() => void);
  color: string;
  header: React.ReactNode;
  subheader: React.ReactNode | null;
  icon: string;
  active?: boolean;
  id: string;
}

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  header,
  subheader = null,
  icon,
  active = false,
}: OptionProps): JSX.Element {
  const content = (
    <Button
      variant="outline"
      onClick={() => clickable && !active && onClick && onClick()}
      my="2"
      borderColor="purple.100"
      _hover={{
        bg: 'white',
        color: 'purple.500',
      }}
      py="8"
      w="100%"
    >
      <Flex w="100%" align="center">
        <Box flex="1" textAlign="left">
          {header}
          {subheader && <Text fontSize="sm">{subheader}</Text>}
        </Box>
        <Center>
          <Image src={icon} w={`${size ?? 32}px`} h={`${size ?? 32}px`} />
        </Center>
      </Flex>
    </Button>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}
