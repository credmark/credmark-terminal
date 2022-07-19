import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  VStack,
} from '@chakra-ui/react';
import SettingsIcon from '@mui/icons-material/Settings';
import { Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';

import { AnyRecord, ModelRunnerConfig } from '~/types/model';

interface ModelRunConfigProps {
  value: ModelRunnerConfig;
  onChange: (config: ModelRunnerConfig) => void;
}

export default function ModelRunConfig({
  value,
  onChange,
}: ModelRunConfigProps) {
  const { values } = useFormikContext<AnyRecord>();

  return (
    <>
      <Accordion allowToggle>
        <AccordionItem borderColor="green.500">
          <AccordionButton>
            <Icon as={SettingsIcon} />
            <Box flex="1" textAlign="left" ml="2">
              Advanced Configuration
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py="8">
            <VStack spacing="8">
              <FormControl>
                <FormLabel>Chain ID</FormLabel>
                <Input
                  type="number"
                  value={value.chainId || ''}
                  onChange={(e) =>
                    onChange({ ...value, chainId: Number(e.target.value) })
                  }
                  placeholder="1"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Block Number</FormLabel>
                <Input
                  type="number"
                  value={value.blockNumber || ''}
                  onChange={(e) =>
                    onChange({ ...value, blockNumber: Number(e.target.value) })
                  }
                  placeholder="latest"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Model Version</FormLabel>
                <Input
                  value={value.version}
                  onChange={(e) =>
                    onChange({ ...value, version: e.target.value })
                  }
                  placeholder="latest"
                />
              </FormControl>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem borderColor="green.500">
          <AccordionButton>
            <Icon as={SettingsIcon} />
            <Box flex="1" textAlign="left" ml="2">
              Utility
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel py="8">
            <VStack spacing="8">
              <Field name="__utilType">
                {({ field, form }: FieldProps<string, AnyRecord>) => {
                  const error = form.errors.__utilType as string;
                  return (
                    <>
                      <FormControl
                        isInvalid={
                          !!error && (form.touched.__utilType as boolean)
                        }
                      >
                        <FormLabel>Type</FormLabel>
                        <Select {...field}>
                          <option value="none">None</option>
                          <option value="historical">Historical</option>
                        </Select>

                        <FormErrorMessage>{error}</FormErrorMessage>
                      </FormControl>
                    </>
                  );
                }}
              </Field>

              {values['__utilType'] === 'historical' && (
                <Field name="__utilWindowValue">
                  {({ field, form }: FieldProps<string, AnyRecord>) => {
                    const error = form.errors.__utilWindowValue as string;
                    return (
                      <>
                        <FormControl
                          isInvalid={
                            !!error &&
                            (form.touched.__utilWindowValue as boolean)
                          }
                        >
                          <FormLabel mt="4">Window</FormLabel>
                          <InputGroup>
                            <Input type="number" pr="10rem" {...field} />
                            <InputRightElement w="10rem">
                              <Select
                                roundedLeft="none"
                                value={
                                  form.values['__utilWindowUnit'] as string
                                }
                                onChange={(e) =>
                                  form.setFieldValue(
                                    '__utilWindowUnit',
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="weeks">Weeks</option>
                                <option value="days">Days</option>
                                <option value="hours">Hours</option>
                                <option value="minutes">Minutes</option>
                                <option value="seconds">Seconds</option>
                              </Select>
                            </InputRightElement>
                          </InputGroup>

                          <FormErrorMessage>{error}</FormErrorMessage>
                        </FormControl>
                      </>
                    );
                  }}
                </Field>
              )}

              {values['__utilType'] === 'historical' && (
                <Field name="__utilIntervalValue">
                  {({ field, form }: FieldProps<string, AnyRecord>) => {
                    const error = form.errors.__utilIntervalValue as string;
                    return (
                      <>
                        <FormControl
                          isInvalid={
                            !!error &&
                            (form.touched.__utilIntervalValue as boolean)
                          }
                        >
                          <FormLabel mt="4">Interval</FormLabel>
                          <InputGroup>
                            <Input type="number" pr="10rem" {...field} />
                            <InputRightElement w="10rem">
                              <Select
                                roundedLeft="none"
                                value={
                                  form.values['__utilIntervalUnit'] as string
                                }
                                onChange={(e) =>
                                  form.setFieldValue(
                                    '__utilIntervalUnit',
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="weeks">Weeks</option>
                                <option value="days">Days</option>
                                <option value="hours">Hours</option>
                                <option value="minutes">Minutes</option>
                                <option value="seconds">Seconds</option>
                              </Select>
                            </InputRightElement>
                          </InputGroup>

                          <FormErrorMessage>{error}</FormErrorMessage>
                        </FormControl>
                      </>
                    );
                  }}
                </Field>
              )}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
