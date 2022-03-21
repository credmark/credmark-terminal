import { Flex, HStack, Switch, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

import { IDataSets } from '~/types/dataset';

interface DataSetSwitcherProps {
  dataSetsStored: IDataSets[];
  dataSetHandler: (dataSet: IDataSets) => void;
}

const DataSetSwitcher: FC<DataSetSwitcherProps> = ({
  dataSetsStored,
  dataSetHandler,
}) => {
  return (
    <Flex gap="4" p="4">
      {dataSetsStored.map((dataSet) => (
        <HStack key={dataSet.label}>
          <Text>{dataSet.label}</Text>
          <Switch colorScheme="pink" onChange={() => dataSetHandler(dataSet)} />
        </HStack>
      ))}
    </Flex>
  );
};
export default DataSetSwitcher;
