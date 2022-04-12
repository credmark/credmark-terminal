import { Box, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';

import { ModelMetadata } from '~/types/model';

import ModelInput from './ModelInput';
import ModelOutput from './ModelOutput';

interface ModelRunnerProps {
  model: ModelMetadata;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InputValues = Record<string, any>;

export default function ModelRunner({ model }: ModelRunnerProps) {
  const toast = useToast();
  const [output, setOutput] = useState<InputValues>();

  function onRun(inputValues: InputValues): Promise<void> {
    setOutput(undefined);

    return axios({
      method: 'POST',
      url: 'https://gateway.credmark.com/v1/model/run',
      data: {
        slug: model.slug,
        // version: '', Optional
        chainId: 1,
        blockNumber: 'latest',
        input: inputValues,
      },
    })
      .then((resp) => {
        if (resp.data.error) {
          throw new Error(resp.data.error);
        }

        setOutput(resp.data.output);
      })
      .catch((err) => {
        console.log(err);
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
    </VStack>
  );
}
