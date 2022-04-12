import { Box, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';

import { ModelMetadata } from '~/types/model';

import ModelInput from './ModelInput';
import ModelOutput from './ModelOutput';

interface ModelRunnerProps {
  model: ModelMetadata;
}

interface ModelRunError {
  code: string;
  message?: string;
  details?: unknown;
  permanent: boolean;
  stack: Array<{
    blockNumber: number;
    chainId: 1;
    slug: string;
    version: string;
    trace: string;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InputValues = Record<string, any>;

export default function ModelRunner({ model }: ModelRunnerProps) {
  const toast = useToast();
  const [output, setOutput] = useState<InputValues>();
  const [error, setError] = useState<ModelRunError>();

  function onRun(inputValues: InputValues): Promise<void> {
    setOutput(undefined);

    return axios({
      method: 'POST',
      url: 'https://gateway.credmark.com/v1/model/run',
      data: {
        slug: model.slug,
        chainId: 1,
        blockNumber: 'latest',
        input: inputValues,
      },
    })
      .then((resp) => {
        if (resp.data.error) {
          setError(resp.data.error);
          console.log(resp.data.error);
          throw new Error(resp.data.error);
        }

        setOutput(resp.data.output);
      })
      .catch(() => {
        toast({
          position: 'top-right',
          status: 'error',
          isClosable: true,
          duration: 10000,
          variant: 'left-accent',
          title: 'Error while running model',
        });
      });
  }

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

      <Box bg="white" rounded="base" p="8">
        <ModelInput modelInput={model.input} onRun={onRun} />
      </Box>
      {output && <ModelOutput model={model} output={output} />}
      {error && (
        <VStack
          bg="red.50"
          borderWidth="1px"
          borderColor="red.500"
          rounded="base"
          spacing="4"
          p="8"
          color="red.500"
          align="stretch"
        >
          <Heading size="md" textAlign="center" mb="4">
            Error while running model
          </Heading>

          <Text fontWeight="bold">
            <i>message: </i>
            {error.message || 'Some unexpected error has occured'}
          </Text>
          <Text>
            <i>code: </i>
            {error.code || '-'}
          </Text>
          <Text>
            <i>details: </i>
            {JSON.stringify(error.details ?? {})}
          </Text>

          <Box>
            <i>trace:</i>
            {error.stack.map((s, i) => (
              <Box key={i} mt="2">
                <Text>
                  <i>
                    [{i}] chainId: {s.chainId}, block: {s.blockNumber}, slug:{' '}
                    {s.slug}, version: {s.version}
                  </i>
                </Text>
                <Text as="pre">{s.trace}</Text>
              </Box>
            ))}
          </Box>
        </VStack>
      )}
    </VStack>
  );
}
