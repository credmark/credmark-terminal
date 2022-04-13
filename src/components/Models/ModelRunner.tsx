import { Box, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

import {
  CAdvancedConfig,
  CModelMetadata,
  CModelRunError,
  CRecord,
} from '~/types/model';

import ModelInput from './ModelInput';
import ModelOutput from './ModelOutput';
import ModelRunConfig from './ModelRunConfig';
import ModelRunError from './ModelRunError';

interface ModelRunnerProps {
  model: CModelMetadata;
}

const DEFAULT_CONFIG = {
  chainId: 1,
  blockNumber: '',
  version: '',
};

export default function ModelRunner({ model }: ModelRunnerProps) {
  const toast = useToast();
  const [config, setConfig] = useState<CAdvancedConfig>(DEFAULT_CONFIG);

  const [output, setOutput] = useState<CRecord>();
  const [error, setError] = useState<CModelRunError>();

  const onRun = useCallback(
    async (inputValues: CRecord): Promise<void> => {
      setError(undefined);
      setOutput(undefined);

      try {
        const resp = await axios({
          method: 'POST',
          url: 'https://gateway.credmark.com/v1/model/run',
          data: {
            slug: model.slug,
            chainId: config.chainId || 1,
            blockNumber: config.blockNumber || 'latest',
            version: config.version || undefined,
            input: inputValues,
          },
        });

        if (resp.data.error) {
          setError(resp.data.error);
          console.log(resp.data.error);
          throw new Error(resp.data.error);
        }

        setOutput(resp.data.output);
      } catch {
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
    [model.slug, toast, config],
  );

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
      {output && <ModelOutput model={model} output={output} />}
      {error && <ModelRunError error={error} />}
    </VStack>
  );
}
