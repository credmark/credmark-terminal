import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { FastField as Field, FieldArray, FieldProps, getIn } from 'formik';
import React from 'react';

import { Card } from '~/components/base';
import { AnyRecord, FieldType, ModelMetadata } from '~/types/model';
import {
  computeInitialValues,
  getUnreferencedInput,
} from '~/utils/modelSchema';

interface ModelInputProps {
  inputSchema: ModelMetadata['input'];
}

export default function ModelInput({ inputSchema }: ModelInputProps) {
  function getInputFields(type: FieldType, keyPath = ''): React.ReactNode {
    const input = getUnreferencedInput(inputSchema, type);
    switch (input.type) {
      case 'object':
        return (
          <Box key={keyPath}>
            <Text fontWeight="300">
              {input.title && keyPath
                ? `${keyPath}: ${input.title}`
                : input.title ?? keyPath}
            </Text>
            {input.description && (
              <Text fontSize="sm" color="gray.500">
                {input.description}
              </Text>
            )}
            <VStack
              spacing="8"
              pl="8"
              borderLeftWidth="2px"
              borderColor="green.500"
              mt="2"
              align="stretch"
            >
              {Object.entries(input.properties ?? {}).map(([key, value]) =>
                getInputFields(value, `${keyPath}${keyPath ? '.' : ''}${key}`),
              )}
            </VStack>
          </Box>
        );
      case 'array':
        return (
          <FieldArray
            name={keyPath}
            key={keyPath}
            render={(arrayHelpers) => {
              const items: unknown[] =
                getIn(arrayHelpers.form.values, keyPath) ?? [];
              const error =
                typeof getIn(arrayHelpers.form.errors, keyPath) === 'string'
                  ? (getIn(arrayHelpers.form.errors, keyPath) as string)
                  : undefined;

              return (
                <Box key={keyPath}>
                  <Text fontWeight="bold">
                    {input.title && keyPath
                      ? `${keyPath}: ${input.title}`
                      : input.title ?? keyPath}
                  </Text>
                  {input.description && (
                    <Text fontSize="sm" color="gray.500">
                      {input.description}
                    </Text>
                  )}
                  <Box
                    pl="8"
                    borderLeftWidth="2px"
                    borderColor={!error ? 'green.500' : 'red.500'}
                    mt="2"
                  >
                    {items.length > 0 ? (
                      <VStack align="stretch">
                        {items.map((_, index) => (
                          <Box key={index}>
                            {getInputFields(
                              Array.isArray(input.items)
                                ? input.items[0]
                                : input.items,
                              keyPath + `[${index}]`,
                            )}
                            <HStack align="center" mt="4" ml="-2">
                              <Button
                                colorScheme="purple"
                                variant="outline"
                                leftIcon={<Icon as={RemoveIcon} />}
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove
                              </Button>
                              <Button
                                colorScheme="purple"
                                leftIcon={<Icon as={AddIcon} />}
                                onClick={() =>
                                  arrayHelpers.insert(
                                    index,
                                    computeInitialValues(
                                      inputSchema,
                                      Array.isArray(input.items)
                                        ? input.items[0]
                                        : input.items,
                                    ),
                                  )
                                }
                              >
                                Add
                              </Button>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <Box>
                        <Button
                          leftIcon={<Icon as={AddIcon} />}
                          onClick={() =>
                            arrayHelpers.push(
                              computeInitialValues(
                                inputSchema,
                                Array.isArray(input.items)
                                  ? input.items[0]
                                  : input.items,
                              ),
                            )
                          }
                        >
                          Add
                        </Button>
                      </Box>
                    )}
                    {error && (
                      <Text fontSize="sm" color="red.500" mt="2">
                        {error}
                      </Text>
                    )}
                  </Box>
                </Box>
              );
            }}
          />
        );
      case 'boolean':
      case 'integer':
      case 'number':
      case 'string':
      default:
        return (
          <Field key={keyPath} name={keyPath}>
            {({ field, form }: FieldProps<string, AnyRecord>) => {
              let error = getIn(form.errors, keyPath);
              // When field is a nested object in an array and array
              // itself has failed validation, getIn will return first
              // character of array error message
              if (typeof error === 'string' && error.length <= 1) error = '';
              return (
                <FormControl
                  isInvalid={
                    !!error && (getIn(form.touched, keyPath) as boolean)
                  }
                >
                  <FormLabel>
                    {input.title ? `${keyPath}: ${input.title}` : keyPath}
                  </FormLabel>
                  {input.type === 'boolean' ? (
                    <Switch isChecked={Boolean(field.value)} {...field} />
                  ) : (
                    <Input
                      {...field}
                      type={
                        input.type === 'number' || input.type === 'integer'
                          ? 'number'
                          : 'string'
                      }
                    />
                  )}

                  <FormErrorMessage>{error}</FormErrorMessage>
                  <FormHelperText>{input.description}</FormHelperText>
                </FormControl>
              );
            }}
          </Field>
        );
    }
  }

  return (
    <Card px="6" py="4">
      <Heading as="h4" fontSize="lg" mb="4" fontWeight="500">
        Model Input
      </Heading>
      {Object.keys(inputSchema.properties ?? {}).length === 0 ? (
        <Box
          pt="4"
          textAlign="center"
          color="gray.200"
          fontSize="3xl"
          fontWeight="bold"
        >
          No input required
        </Box>
      ) : (
        getInputFields(inputSchema)
      )}
    </Card>
  );
}
