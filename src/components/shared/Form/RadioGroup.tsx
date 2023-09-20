import {
  Box,
  HStack,
  useColorMode,
  useRadio,
  useRadioGroup,
  UseRadioGroupProps,
  UseRadioProps,
} from '@chakra-ui/react';
import React from 'react';

function RadioCard(props: UseRadioProps & { children: React.ReactNode }) {
  const { colorMode } = useColorMode();

  const {
    getInputProps,
    getCheckboxProps,
    state: { isChecked },
  } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="0"
        borderRadius="md"
        boxShadow="sm"
        color={colorMode === 'dark' ? 'whiteAlpha.700' : 'blackAlpha.600'}
        _checked={{
          bg: colorMode === 'dark' ? '#18131b' : 'white',
          color: colorMode === 'light' ? '#18131b' : 'white',
        }}
        _hover={
          isChecked
            ? {}
            : {
                bg: 'blackAlpha.100',
              }
        }
        px={4}
        py={1}
        transitionProperty="common"
        transitionDuration="normal"
        whiteSpace="nowrap"
        fontSize="sm"
      >
        {props.children}
      </Box>
    </Box>
  );
}

interface RadioGroupProps extends UseRadioGroupProps {
  options: string[];
}

export default function RadioGroup({
  options,
  ...props
}: RadioGroupProps): JSX.Element {
  const { colorMode } = useColorMode();

  const { getRootProps, getRadioProps } = useRadioGroup(props);

  const group = getRootProps();

  return (
    <HStack
      {...group}
      spacing="1"
      borderWidth="2px"
      borderColor={colorMode === 'dark' ? '#18131b' : 'white'}
      rounded="lg"
      p="3px"
    >
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
}
