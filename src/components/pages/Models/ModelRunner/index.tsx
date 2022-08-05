import { Box, Heading, Icon, Text, useToast, VStack } from '@chakra-ui/react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Form, Formik } from 'formik';
import { Duration } from 'luxon';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';

import { PrimaryButton } from '~/components/base';
import {
  useModelRunner,
  ModelRunnerProps as UseModelRunnerProps,
  HistoricalModelRunnerProps,
} from '~/hooks/useModel';
import { AnyRecord, ModelMetadata, ModelRunnerConfig } from '~/types/model';
import {
  computeInitialValues,
  computeValidationSchema,
  wrapWithBlockSeries,
} from '~/utils/modelSchema';

import ModelInput from './ModelInput';
import ModelOutput from './ModelOutput';
import ModelRunConfig from './ModelRunConfig';
import ModelRunErrorAlert from './ModelRunErrorAlert';

interface ModelRunnerProps {
  model: ModelMetadata;
}

const DEFAULT_CONFIG: ModelRunnerConfig = {
  chainId: 1,
  blockNumber: '',
  version: '',
};

export default function ModelRunner({ model }: ModelRunnerProps) {
  const toast = useToast();
  const [config, setConfig] = useState<ModelRunnerConfig>(DEFAULT_CONFIG);
  const [suspended, setSuspended] = useState(true);
  const [inputValues, setInputValues] = useState<AnyRecord>();

  const modelRunnerProps: UseModelRunnerProps<AnyRecord> = {
    suspended,
    slug: model.slug,
    input: inputValues,
    chainId: config.chainId || 1,
    blockNumber: (config.blockNumber as number) || ('latest' as const),
    version: config.version || undefined,
    afterRun: () => {
      setSuspended(true);
      if (error) {
        toast({
          position: 'top-right',
          status: 'error',
          isClosable: true,
          duration: 10000,
          variant: 'solid',
          title: 'Error while running model',
        });
      }
    },
  };

  if (config.utility?.type === 'historical') {
    (modelRunnerProps as HistoricalModelRunnerProps<AnyRecord>).window =
      Duration.fromObject({
        [config.utility.window.unit]: config.utility.window.value,
      });

    (modelRunnerProps as HistoricalModelRunnerProps<AnyRecord>).interval =
      Duration.fromObject({
        [config.utility.interval.unit]: config.utility.interval.value,
      });
  }

  const { output, error, loading } =
    useModelRunner<AnyRecord>(modelRunnerProps);

  const initialValues = useMemo(
    () => ({
      ...(computeInitialValues(model.input, model.input) as AnyRecord),
      __utilType: 'none',
      __utilWindowValue: 0,
      __utilWindowUnit: 'days',
      __utilIntervalValue: 0,
      __utilIntervalUnit: 'days',
    }),
    [model.input],
  );

  const validationSchema = useMemo(
    () =>
      computeValidationSchema(model.input, model.input).concat(
        Yup.object().shape({
          __utilType: Yup.string().oneOf(['none', 'historical']),
          __utilWindowValue: Yup.number().when('__utilType', {
            is: 'historical',
            then: Yup.number().integer().positive('Window should be positive'),
          }),
          __utilWindowUnit: Yup.string(),
          __utilIntervalValue: Yup.number().when('__utilType', {
            is: 'historical',
            then: Yup.number()
              .integer()
              .positive('Interval should be positive'),
          }),
          __utilIntervalUnit: Yup.string(),
        }),
      ),
    [model.input],
  );

  const onRun = useCallback(
    ({
      __utilType,
      __utilWindowValue,
      __utilWindowUnit,
      __utilIntervalValue,
      __utilIntervalUnit,
      ...inputValues
    }: AnyRecord) => {
      setConfig({
        ...config,
        utility:
          __utilType === 'historical'
            ? {
                type: 'historical',
                window: { value: __utilWindowValue, unit: __utilWindowUnit },
                interval: {
                  value: __utilIntervalValue,
                  unit: __utilIntervalUnit,
                },
              }
            : { type: 'none' },
      });

      setInputValues(inputValues);
      setSuspended(false);
    },
    [config],
  );

  useEffect(() => {
    setConfig(DEFAULT_CONFIG);
  }, [model.slug]);

  const outputSchema = useMemo(() => {
    if (config.utility?.type === 'historical') {
      return wrapWithBlockSeries(model.output);
    }

    return model.output;
  }, [config.utility?.type, model.output]);

  return (
    <VStack py="8" align="stretch" spacing="8">
      <Box maxW="container.md" mx="auto">
        <Heading textAlign="center" as="h2" size="lg">
          {model.displayName}{' '}
          <Text fontSize="md" fontWeight="normal" color="gray.500">
            <i>{model.slug}</i>
          </Text>
        </Heading>

        <Text mt="2" fontSize="sm" textAlign="center">
          {model.description}
        </Text>
      </Box>
      <Formik
        initialValues={initialValues}
        onSubmit={onRun}
        validationSchema={validationSchema}
      >
        <Form>
          <ModelRunConfig value={config} onChange={setConfig} />
          <Box h="8" />
          <ModelInput inputSchema={model.input} />
          <Box mt="16" textAlign="center">
            <PrimaryButton
              type="submit"
              size="lg"
              px="16"
              rightIcon={<Icon as={PlayArrowIcon} />}
              isLoading={loading}
              loadingText="Running..."
            >
              Run
            </PrimaryButton>
          </Box>
        </Form>
      </Formik>
      {output && (
        <ModelOutput
          title={model.displayName ?? model.slug}
          outputSchema={outputSchema}
          result={output}
        />
      )}
      {error && <ModelRunErrorAlert error={error} />}
    </VStack>
  );
}
