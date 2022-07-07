import {
  Box,
  Container,
  InputRightElement,
  InputGroup,
  Input,
  Text,
  Flex,
  Grid,
  Center,
  Spinner,
  FormControl,
  FormHelperText,
} from '@chakra-ui/react';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Token } from '@uniswap/sdk-core';
import { isAddress } from 'ethers/lib/utils';
import { DateTime } from 'luxon';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import Card from '~/components/base/Card';
const SharpeChartBox = dynamic(
  () => import('~/components/pages/Terminal/SharpeChartBox'),
  { ssr: false },
);
const PieCharts = dynamic(() => import('~/components/shared/Charts/PieChart'), {
  ssr: false,
});
import SEOHeader from '~/components/shared/SEOHeader';
import useDebounce from '~/hooks/useDebounce';
import { useModelRunner } from '~/hooks/useModel';
import { ModelRunError } from '~/types/model';

const dataset = [
  { value: 100, category: 'eth', name: 'Ethereum' },
  { value: 1500, category: 'btc', name: 'Bitcoin' },
  { value: 830, category: 'dai', name: 'Dai' },
  { value: 40, category: 'usdc', name: 'USDC Stable coin' },
  { value: 33, category: 'shib', name: 'Shiba Inu' },
];
interface BlockNumberOutput {
  blockNumber: number;
  blockTimestamp: number;
  sampleTimestamp: number;
}
interface TvlModelOutput {
  error?: ModelRunError;
  errorMessage?: string;
  loading?: boolean;
  output?: {
    positions: {
      amount: number;
      asset: {
        address: string;
      };
    }[];
  };
}

const PortfolioSharpes = ({
  error,
  tokens,
  loading,
}: {
  error?: string;
  tokens?: Token[];
  loading?: boolean;
}) => {
  if (loading)
    return (
      <Center position="absolute" top="25%" w="100%">
        <Spinner />
      </Center>
    );
  if (error) return <div>{error || 'Error occured'}</div>;
  if (!tokens) return <div>{'Error loading tokens'}</div>;
  return (
    <SharpeChartBox
      tokens={tokens}
      defaultTokens={tokens.slice(0, 5)}
      isPortfolioOnly
    />
  );
};
const Portfolio = () => {
  const [inputAddress, setInputAddress] = useState<string>(
    '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  );
  const blockNumberModel = useModelRunner<BlockNumberOutput>({
    slug: 'rpc.get-blocknumber',
    input: { timestamp: DateTime.utc().startOf('day').toSeconds() },
  });
  const debouncedInput = useDebounce(inputAddress, 300);

  const tvlModel: TvlModelOutput = useModelRunner({
    slug: 'account.portfolio',
    input: {
      address: debouncedInput,
    },
    suspended: !blockNumberModel.output,
    blockNumber: blockNumberModel.output?.blockNumber,
  });

  const tvlChart = {
    data: tvlModel?.output?.positions?.map((item) => ({
      amount: item.amount,
      value: item.asset.address,
    })),
    loading: tvlModel?.loading || blockNumberModel?.loading,
    error: tvlModel?.errorMessage,
  };

  const tokens = tvlModel?.output?.positions?.map((item) => {
    return new Token(1, item?.asset?.address, 18);
  });
  return (
    <>
      <SEOHeader title="Portfolio Analytics" />
      <Container p="8" maxW="container.xl">
        <Flex gap="40px" flexDirection="column">
          <Text size="18px" fontWeight="700">
            Portfolio Analytics
          </Text>
          <Flex gap="40px" flexDirection="column">
            <Box>
              <FormControl
                isInvalid={!!(inputAddress && !isAddress(inputAddress))}
                isDisabled={tvlModel?.loading}
              >
                <InputGroup maxW="461px" w="100%" h="40px">
                  <Input
                    placeholder="Enter a wallet address..."
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setInputAddress(event?.target.value)
                    }
                  />
                  <InputRightElement>
                    <CreditCardIcon sx={{ color: 'gray' }} />
                  </InputRightElement>
                </InputGroup>
                {inputAddress && !isAddress(inputAddress) && (
                  <FormHelperText>Enter a valid wallet address</FormHelperText>
                )}
              </FormControl>
            </Box>
            <Grid
              gridTemplateColumns={{ base: '1fr 1fr', lg: '320px 1fr' }}
              gap="40px"
            >
              <Card shadow="md" w="320px">
                <Flex
                  gap="40px"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  w="100%"
                >
                  <Box>
                    <Text size="24px" fontWeight="700" textAlign="center">
                      Total Portfolio Value
                    </Text>
                    <Text size="48px" fontWeight="700" textAlign="center">
                      $6,002,548.57
                    </Text>
                  </Box>
                  <Box width="100%" minHeight="300px">
                    <PieCharts
                      title="Portfolio Distribution"
                      dataset={dataset}
                      height={200}
                    />
                  </Box>
                </Flex>
              </Card>
              <Flex w="100%" gap="40px" flexDirection="column">
                <Flex gap="40px" justifyContent="space-between" w="100%">
                  <Card shadow="md" w="100%" maxWidth="412px">
                    <Text size="24px" fontWeight="700" textAlign="center">
                      Total Value at Risk
                    </Text>
                    <Text size="48px" fontWeight="700" textAlign="center">
                      $9,609.64
                    </Text>
                  </Card>
                  <Card shadow="md" w="100%" maxWidth="412px">
                    <Text size="24px" fontWeight="700" textAlign="center">
                      Total Value at Risk / Total Value
                    </Text>
                    <Text size="48px" fontWeight="700" textAlign="center">
                      0.16%
                    </Text>
                  </Card>
                </Flex>
                <Card h="100%" shadow="md" minHeight="300px" width="100%">
                  <h1>charts</h1>
                </Card>
              </Flex>
            </Grid>
          </Flex>
          <Box minHeight="300px" position="relative">
            <PortfolioSharpes
              error={tvlChart.error}
              tokens={tokens}
              loading={tvlChart.loading}
            />
          </Box>
        </Flex>
      </Container>
    </>
  );
};

export default Portfolio;
