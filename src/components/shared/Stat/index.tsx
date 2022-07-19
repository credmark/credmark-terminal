import { Box, HStack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

interface StatProps {
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
  highlightColor?: string;
  onClick?: () => void;
  _hover?: Partial<Omit<StatProps, '_hover'>>;
}

export default function Stat({ _hover, ...props }: StatProps) {
  const [isHovering, setIsHovering] = useState(false);

  const effectiveProp = (key: keyof Omit<StatProps, '_hover'>) => {
    return isHovering && _hover?.[key] ? _hover[key] : props[key];
  };

  const icon = effectiveProp('icon') as StatProps['icon'];
  const label = effectiveProp('label') as StatProps['label'];
  const value = effectiveProp('value') as StatProps['value'];
  const highlightColor = effectiveProp(
    'highlightColor',
  ) as StatProps['highlightColor'];
  const onClick = effectiveProp('onClick') as StatProps['onClick'];

  return (
    <HStack
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      cursor={typeof onClick === 'function' ? 'pointer' : undefined}
    >
      {icon && <>{icon}</>}
      <Box textAlign="left">
        <Text fontSize="sm" fontWeight="300" as="div">
          {label}
        </Text>
        <Text
          as="span"
          fontSize="md"
          fontWeight="500"
          px="0.5"
          bg={highlightColor}
        >
          {value}
        </Text>
      </Box>
    </HStack>
  );
}
