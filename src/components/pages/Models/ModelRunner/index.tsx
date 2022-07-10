import { Box, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import { Duration } from 'luxon';
import React, { useEffect, useState } from 'react';

import { useModelRunner } from '~/hooks/useModel';
import { AnyRecord, ModelMetadata, ModelRunnerConfig } from '~/types/model';

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

  const { output, error } = useModelRunner<AnyRecord>({
    suspended,
    slug: model.slug,
    input: inputValues,
    chainId: config.chainId || 1,
    blockNumber: (config.blockNumber as number) || ('latest' as const),
    version: config.version || undefined,
    window: Duration.fromObject({ days: 30 }),
    interval: Duration.fromObject({ days: 1 }),
    afterRun: () => {
      setSuspended(true);
      if (error) {
        toast({
          position: 'top-right',
          status: 'error',
          isClosable: true,
          duration: 10000,
          variant: 'left-accent',
          title: 'Error while running model',
        });
      }
    },
  });

  function onRun(inputValues: AnyRecord): void {
    setInputValues(inputValues);
    setSuspended(false);
  }

  useEffect(() => {
    setConfig(DEFAULT_CONFIG);
  }, [model.slug]);

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

      <ModelRunConfig value={config} onChange={setConfig} />
      <ModelInput modelInput={model.input} onRun={onRun} />
      {output && <ModelOutput model={model} result={output} />}
      {error && <ModelRunErrorAlert error={error} />}
    </VStack>
  );
}
