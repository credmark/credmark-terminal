import { Flex } from '@chakra-ui/react';
import React from 'react';

import GaugeChart from '~/components/shared/Charts/GaugeChart';

import daiUsdcUsdtLabel from '../../public/img/assets/dai-usdc-usdt-label.svg';
import daiUsdcUsdt from '../../public/img/assets/dai-usdc-usdt.svg';

export default {
  title: 'Components/Charts/GaugeChart',
  component: GaugeChart,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const datasetA = { value: 160, category: 'dai', name: 'Dai', color: '#00D696' };
const datasetB = {
  value: 90,
  category: 'usdc',
  name: 'USDC',
  color: '#FF7154',
};
const datasetC = {
  value: 10,
  category: 'var-tvl',
  name: 'VaR/TVL',
  color: '#FF7154',
};
const datasetD = {
  value: 60,
  category: 'lcr',
  name: 'LCR',
  color: '#FFDD00',
};

const Template = () => {
  return (
    <Flex
      justifyContent="space-evenly"
      alignItems="center"
      gap="20px"
      background="#E5E5E5"
      padding="20px"
    >
      <GaugeChart
        titleImg={daiUsdcUsdt}
        datasetA={datasetA}
        datasetB={datasetB}
        chartHeaderLabelBackgroundColor={daiUsdcUsdtLabel}
        chartHeaderLabelName="Balancer"
      />
      <GaugeChart
        titleImg={daiUsdcUsdt}
        datasetA={datasetC}
        datasetB={datasetD}
        chartHeaderLabelBackgroundColor={daiUsdcUsdtLabel}
        chartHeaderLabelName="Balancer"
      />
    </Flex>
  );
};

export const Primary = Template.bind({});
