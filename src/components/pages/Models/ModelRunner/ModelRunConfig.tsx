import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  FormControl,
  FormLabel,
  Icon,
  Input,
  VStack,
} from '@chakra-ui/react';
import SettingsIcon from '@mui/icons-material/Settings';
import React from 'react';

import { ModelRunnerConfig } from '~/types/model';

interface ModelRunConfigProps {
  value: ModelRunnerConfig;
  onChange: (config: ModelRunnerConfig) => void;
}

export default function ModelRunConfig({
  value,
  onChange,
}: ModelRunConfigProps) {
  return (
    <Accordion allowToggle>
      <AccordionItem borderColor="green.500" rounded="base" borderWidth="1px">
        <AccordionButton
          rounded="base"
          _expanded={{ bg: 'white', color: 'green.500' }}
          _hover={{ bg: 'green.50' }}
        >
          <Icon as={SettingsIcon} />
          <Box flex="1" textAlign="left" ml="2">
            Advanced Configuration
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel bg="white" roundedBottom="base" py="8">
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
    </Accordion>
  );
}