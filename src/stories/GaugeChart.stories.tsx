import { Flex } from '@chakra-ui/react';
import React from 'react';

import StableCoinHealth from '~/components/shared/Card/StableCoinHealth';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import {
  DoubleGaugeChart,
  SingleGaugeChart,
} from '~/components/shared/Charts/GaugeChart';

import daiUsdcUsdtLabel from '../../public/img/assets/dai-usdc-usdt-label.svg';
import daiUsdcUsdt from '../../public/img/assets/dai-usdc-usdt.svg';

export default {
  title: 'Components/Charts/GaugeChart',
  component: DoubleGaugeChart,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const datasetA = { value: 100, category: 'dai', name: 'Dai', color: '#00D696' };
const datasetB = {
  value: 100,
  category: 'usdc',
  name: 'USDC',
  color: '#FF7154',
};
const datasetC = {
  value: 100,
  category: 'var-tvl',
  name: 'VaR/TVL',
  color: '#5470c6',
};

const Template = () => {
  const title = 'Stable Coin Health';
  const seriesName = 'Stable Coin Health';
  return (
    <Flex
      justifyContent="space-evenly"
      alignItems="center"
      gap="20px"
      padding="20px"
      background="#E5E5E5"
    >
      <StableCoinHealth
        chartHeaderLabelBackgroundColor={daiUsdcUsdtLabel}
        chartHeaderLabelName="Balancer"
        chartHeader={
          <>
            <ChartHeader
              logo={daiUsdcUsdt}
              title={title}
              downloadCsv={{
                filename: `${title?.replace(/\s/g, '-')}.csv`,
                data: [{ value: datasetB.value }],

                headers: [seriesName],
              }}
              noShadow={true}
            />
          </>
        }
      >
        <DoubleGaugeChart datasetA={datasetA} datasetB={datasetB} />
      </StableCoinHealth>

      <StableCoinHealth
        chartHeaderLabelBackgroundColor={daiUsdcUsdtLabel}
        chartHeaderLabelName="Balancer"
        chartHeader={
          <>
            <ChartHeader
              logo={daiUsdcUsdt}
              title={title}
              downloadCsv={{
                filename: `${title?.replace(/\s/g, '-')}.csv`,
                data: [{ value: datasetB.value }],

                headers: [seriesName],
              }}
              noShadow={true}
            />
          </>
        }
      >
        <SingleGaugeChart dataset={datasetC} gaugeType="top" />
      </StableCoinHealth>

      <StableCoinHealth
        chartHeaderLabelBackgroundColor={daiUsdcUsdtLabel}
        chartHeaderLabelName="Balancer"
        chartHeader={
          <>
            <ChartHeader
              logo={daiUsdcUsdt}
              title={title}
              downloadCsv={{
                filename: `${title?.replace(/\s/g, '-')}.csv`,
                data: [{ value: datasetB.value }],

                headers: [seriesName],
              }}
              noShadow={true}
            />
          </>
        }
      >
        <SingleGaugeChart dataset={datasetC} gaugeType="bottom" />
      </StableCoinHealth>
    </Flex>
  );
};

export const Primary = Template.bind({});
