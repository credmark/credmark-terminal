import { Flex } from '@chakra-ui/react';
import React from 'react';

import StableCoinHealth from '~/components/shared/Card/StableCoinHealth';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import {
  DoubleGaugeChart,
  SingleGaugeChart,
} from '~/components/shared/Charts/GaugeChart';
import CurrencyLogo, { CurrenciesLogo } from '~/components/shared/CurrencyLogo';

import daiUsdcUsdtLabel from '../../public/img/assets/dai-usdc-usdt-label.svg';

export default {
  title: 'Components/Charts/GaugeChart',
  component: DoubleGaugeChart,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const datasetA = {
  value: 100,
  category: 'fei',
  name: 'FEI USD',
  color: '#00D696',
  token: {
    chainId: 1,
    decimals: 18,
    symbol: 'FEI',
    name: 'Fei USD',
    isNative: false,
    isToken: true,
    address: '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
  },
};
const datasetB = {
  value: 100,
  category: 'tribe',
  name: 'TRIBE',
  color: '#FF7154',
  token: {
    chainId: 1,
    decimals: 18,
    symbol: 'TRIBE',
    name: 'Tribe',
    isNative: false,
    isToken: true,
    address: '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
  },
};
const datasetC = {
  value: 100,
  category: 'tribe',
  name: 'TRIBE',
  color: '#5470c6',
  token: {
    chainId: 1,
    decimals: 18,
    symbol: 'TRIBE',
    name: 'Tribe',
    isNative: false,
    isToken: true,
    address: '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
  },
};

const Template = () => {
  const title = 'Lorem ipsum';
  const seriesName = 'Lorem ipsum';
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
              logo={
                <CurrenciesLogo currencies={[datasetA.token, datasetB.token]} />
              }
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
              logo={<CurrencyLogo currency={datasetA.token} />}
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
              logo={<CurrencyLogo currency={datasetB.token} />}
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
