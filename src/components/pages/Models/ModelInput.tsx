import {
  Box,
  VStack,
  Button,
  Icon,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Switch,
  Text,
  HStack,
} from '@chakra-ui/react';
import {
  Formik,
  Form,
  FastField as Field,
  FieldProps,
  FormikHelpers,
  getIn,
  FieldArray,
} from 'formik';
import React, { useCallback, useMemo } from 'react';
import { MdAdd, MdPlayArrow, MdRemove } from 'react-icons/md';
import * as Yup from 'yup';

import {
  CType,
  CTypeArray,
  CTypeBoolean,
  CTypeInteger,
  CTypeObject,
  CTypeString,
  CModelMetadata,
  CRecord,
} from '~/types/model';

interface ModelInputProps {
  modelInput: CModelMetadata['input'];
  onRun: (input: CRecord) => Promise<void>;
}

export default function ModelInput({ modelInput, onRun }: ModelInputProps) {
  const getUnreferencedInput = useCallback(
    (
      input: CType,
    ): CTypeObject | CTypeArray | CTypeString | CTypeInteger | CTypeBoolean => {
      if ('$ref' in input) {
        const refKey = Object.keys(modelInput.definitions ?? {}).find(
          (def) => def === input.$ref.split('/').pop(),
        );

        if (!refKey) {
          throw new Error('Invalid ref');
        }

        return (modelInput.definitions ?? {})[refKey] as
          | CTypeObject
          | CTypeArray
          | CTypeString
          | CTypeInteger
          | CTypeBoolean;
      } else if ('allOf' in input) {
        return getUnreferencedInput(input.allOf[0]);
      }

      return input;
    },
    [modelInput.definitions],
  );

  const computeInitialValues = useCallback(
    (type: CType): CRecord | boolean | string | number | unknown[] => {
      const input = getUnreferencedInput(type);
      switch (input.type) {
        case 'object':
          return Object.entries(input.properties ?? {}).reduce<CRecord>(
            (iv, [key, value]) => ({
              ...iv,
              [key]: computeInitialValues(value),
            }),
            {},
          );
        case 'array':
          return [];
        case 'boolean':
          return input.default ?? false;
        case 'integer':
        case 'number':
          return input.default ?? 0;
        case 'string':
        default:
          return input.default ?? '';
      }
    },
    [getUnreferencedInput],
  );

  const computeValidationSchema = useCallback(
    (type: CType, required: string[] = [], key = ''): Yup.BaseSchema => {
      const input = getUnreferencedInput(type);
      switch (input.type) {
        case 'object': {
          return Yup.object().shape(
            Object.entries(input.properties ?? {}).reduce<CRecord>(
              (iv, [key, value]) => ({
                ...iv,
                [key]: computeValidationSchema(value, input.required, key),
              }),
              {},
            ),
          );
        }
        case 'array': {
          let schema = Yup.array().of(
            computeValidationSchema(
              Array.isArray(input.items) ? input.items[0] : input.items,
            ),
          );
          if (input.minItems) schema = schema.min(input.minItems);
          if (input.maxItems) schema = schema.min(input.maxItems);
          return schema;
        }
        case 'boolean': {
          let schema = Yup.boolean();
          if (required.includes(key)) schema = schema.required('Required.');
          return schema;
        }
        case 'integer':
        case 'number': {
          let schema = Yup.number();
          if (required.includes(key)) schema = schema.required('Required.');
          return schema;
        }
        case 'string':
        default: {
          let schema = Yup.string().ensure();
          if (required.includes(key)) schema = schema.required('Required.');
          if (input.maxLength)
            schema = schema.max(
              input.maxLength,
              `Cannot be more than ${input.maxLength} characters`,
            );
          if (input.pattern)
            schema = schema.matches(
              new RegExp(input.pattern),
              `Invalid value. Not matching ${input.pattern}`,
            );
          return schema;
        }
      }
    },
    [getUnreferencedInput],
  );

  const initialValues = useMemo(() => {
    return computeInitialValues(modelInput) as CRecord;
  }, [computeInitialValues, modelInput]);

  const validationSchema = useMemo(() => {
    return computeValidationSchema(modelInput);
  }, [computeValidationSchema, modelInput]);

  function onSubmit(
    inputValues: CRecord,
    actions: FormikHelpers<CRecord>,
  ): void {
    actions.setSubmitting(true);
    onRun(inputValues).finally(() => actions.setSubmitting(false));
  }

  function getInputFields(type: CType, keyPath = ''): React.ReactNode {
    const input = getUnreferencedInput(type);
    switch (input.type) {
      case 'object':
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
            <VStack
              spacing="8"
              pl="8"
              borderLeftWidth="2px"
              borderColor="purple.500"
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
                    spacing="8"
                    pl="8"
                    borderLeftWidth="2px"
                    borderColor={!error ? 'purple.500' : 'red.500'}
                    mt="2"
                    align="stretch"
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
                                leftIcon={<Icon as={MdRemove} />}
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                Remove
                              </Button>
                              <Button
                                colorScheme="purple"
                                leftIcon={<Icon as={MdAdd} />}
                                onClick={() =>
                                  arrayHelpers.insert(
                                    index,
                                    computeInitialValues(
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
                          leftIcon={<Icon as={MdAdd} />}
                          onClick={() =>
                            arrayHelpers.push(
                              computeInitialValues(
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
            {({ field, form }: FieldProps<string, CRecord>) => {
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
    <Box bg="white" rounded="base" p="8" shadow="2xl">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            {Object.keys(modelInput.properties ?? {}).length === 0 ? (
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
              getInputFields(modelInput)
            )}
            <Box mt="16" textAlign="center">
              <Button
                type="submit"
                colorScheme="pink"
                size="lg"
                px="16"
                rightIcon={<Icon as={MdPlayArrow} />}
                isLoading={isSubmitting}
                loadingText="Running..."
              >
                Run
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
