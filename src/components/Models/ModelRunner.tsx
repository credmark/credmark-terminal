import { Box, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useCallback, useState } from 'react';

import { CModelMetadata, CModelRunError, CRecord } from '~/types/model';

import ModelInput from './ModelInput';
import ModelOutput from './ModelOutput';
import ModelRunError from './ModelRunError';

interface ModelRunnerProps {
  model: CModelMetadata;
}

export default function ModelRunner({ model }: ModelRunnerProps) {
  const toast = useToast();
  const [output, setOutput] = useState<CRecord>();
  const [error, setError] = useState<CModelRunError>();

  const onRun = useCallback(
    async (inputValues: CRecord): Promise<void> => {
      setOutput(undefined);

      try {
        const resp = await axios({
          method: 'POST',
          url: 'https://gateway.credmark.com/v1/model/run',
          data: {
            slug: model.slug,
            chainId: 1,
            blockNumber: 'latest',
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
    [model.slug, toast],
  );

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

      <ModelInput modelInput={model.input} onRun={onRun} />
      {output && <ModelOutput model={model} output={output} />}
      {error && <ModelRunError error={error} />}
    </VStack>
  );
}
