import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { Token } from '@uniswap/sdk-core';
import React from 'react';

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
  token: new Token(
    1,
    '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
    18,
    'FEI',
    'Fei USD',
  ),
};
const datasetB = {
  value: 100,
  category: 'tribe',
  name: 'TRIBE',
  color: '#FF7154',
  token: new Token(
    1,
    '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
    18,
    'TRIBE',
    'Tribe',
  ),
};
const datasetC = {
  value: 100,
  category: 'tribe',
  name: 'TRIBE',
  color: '#5470c6',
  token: new Token(
    1,
    '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
    18,
    'TRIBE',
    'Tribe',
  ),
};

interface StableCoinHealthProps {
  children: React.ReactNode;
  chartHeader: React.ReactNode;
  chartHeaderLabelBackgroundColor: string;
  chartHeaderLabelName: string;
}
const StableCoinHealth = (props: StableCoinHealthProps) => {
  const {
    children,
    chartHeader,
    chartHeaderLabelName,
    chartHeaderLabelBackgroundColor,
  } = props;
  return (
    <Grid
      shadow="md"
      background="white"
      gridTemplateRows="40px 1fr"
      gridTemplateColumns="1fr"
      height="400px"
      borderRadius="4px"
    >
      {chartHeader}
      <Box pl="15px" pr="15px" overflow="hidden">
        <Flex width="max-content" height="42px" alignItems="center">
          <Text
            backgroundImage={chartHeaderLabelBackgroundColor}
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            borderRadius="16px"
            fontSize="xs"
            color="white"
            pl="10px"
            pr="10px"
          >
            {chartHeaderLabelName}
          </Text>
        </Flex>
        <Grid
          w="382px"
          gridTemplateRows="repeat(2, 200px)"
          gridTemplateColumns="1fr"
        >
          {children}
        </Grid>
      </Box>
    </Grid>
  );
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
