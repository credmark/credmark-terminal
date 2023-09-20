import {
  Center,
  chakra,
  Container,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import {
  BsChevronDown,
  BsChevronExpand,
  BsChevronUp,
  BsSearch,
} from 'react-icons/bs';

import IchiPerformanceCard, {
  IchiVault,
  VaultPerformance,
} from '~/components/pages/Terminal/IchiPerformanceCard';
import RadioGroup from '~/components/shared/Form/RadioGroup';
import LazyLoad from '~/components/shared/LazyLoad';
import SEOHeader from '~/components/shared/SEOHeader';
import { useModelRunner } from '~/hooks/useModel';

interface BlockNumberOutput {
  blockNumber: number;
  blockTimestamp: number;
  sampleTimestamp: number;
}

const useIchiVaults = (chainId: number) => {
  const blockNumberModel = useModelRunner<BlockNumberOutput>({
    chainId,
    slug: 'ichi/rpc.get-blocknumber',
    input: { timestamp: DateTime.utc().startOf('day').toSeconds() },
  });

  const vaultsModel = useModelRunner<{
    vaults: Record<string, IchiVault>;
  }>({
    chainId,
    blockNumber: blockNumberModel.output?.blockNumber,
    slug: 'ichi/ichi.vaults',
    input: {},
    suspended: !blockNumberModel.output,
  });

  const performanceModel = useModelRunner<{
    results: Array<{ output: VaultPerformance }>;
  }>({
    chainId,
    blockNumber: blockNumberModel.output?.blockNumber,
    slug: 'compose.map-inputs',
    input: {
      modelSlug: 'ichi/ichi.vault-performance',
      modelInputs: Object.values(vaultsModel.output?.vaults ?? {}).map(
        (vault) => ({
          address: vault.vault,
          days_horizon: [7, 30, 60, 365],
          base: 1000,
        }),
      ),
    },
    suspended: !blockNumberModel.output || !vaultsModel.output,
  });

  const loading =
    (blockNumberModel.loading ||
      vaultsModel.loading ||
      performanceModel.loading) &&
    !performanceModel.output;

  return {
    chainId,
    loading,
    output: performanceModel.output
      ? performanceModel.output.results.map((result, index) => ({
          chainId,
          vault: Object.values(vaultsModel.output?.vaults ?? {})[index],
          performance: result.output,
        }))
      : undefined,
  };
};

export default function IchiYieldIQPage() {
  const { colorMode } = useColorMode();

  const [duration, setDuration] = useState(7);
  const [sorter, setSorter] = useState<{
    key: string;
    direction: 'ASC' | 'DESC';
  }>({
    key: 'duration',
    direction: 'ASC',
  });
  const [depositTokenFilter, setDepositTokenFilter] = useState('');

  useEffect(() => {
    setSorter({
      key: 'duration',
      direction: 'ASC',
    });
  }, [duration]);

  const allVaults = [
    useIchiVaults(1), // Ethereum
    useIchiVaults(137), // Polygon
    useIchiVaults(42161), // Arbitrum
  ];

  type S = {
    chainId: number;
    vault: IchiVault;
    performance: VaultPerformance;
  };

  const columns = [
    {
      key: 'depositToken',
      label: 'Deposit Token',
      sorter: (a: S, b: S) => {
        const aDepositToken = a.vault.allow_token0
          ? a.vault.token0_symbol
          : a.vault.token1_symbol;
        const bDepositToken = b.vault.allow_token0
          ? b.vault.token0_symbol
          : b.vault.token1_symbol;

        return aDepositToken.localeCompare(bDepositToken);
      },
    },
    {
      key: 'pairedToken',
      label: 'Paired Token',
      sorter: (a: S, b: S) => {
        const aPairedToken = a.vault.allow_token0
          ? a.vault.token1_symbol
          : a.vault.token0_symbol;
        const bPairedToken = b.vault.allow_token0
          ? b.vault.token1_symbol
          : b.vault.token0_symbol;

        return aPairedToken.localeCompare(bPairedToken);
      },
    },
    {
      key: 'network',
      label: 'Network',
      sorter: (a: S, b: S) => a.chainId - b.chainId,
    },
    {
      key: 'annualizedYield',
      label: 'Annualized Yield',
      sorter: (a: S, b: S) =>
        a.performance.irr_cashflow_365 - b.performance.irr_cashflow_365,
    },
    {
      key: 'duration',
      label: `${duration} Days`,
      sorter: (a: S, b: S) =>
        (a.performance[
          `irr_cashflow_${duration}` as keyof VaultPerformance
        ] as number) -
        (b.performance[
          `irr_cashflow_${duration}` as keyof VaultPerformance
        ] as number),
    },
    {
      key: 'tvl',
      label: 'TVL',
      sorter: (a: S, b: S) => a.performance.tvl - b.performance.tvl,
    },
  ];

  const displayVaults = (() => {
    if (allVaults.find((v) => !v.output)) {
      return [];
    }

    return (
      allVaults
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((av) => av.output!)
        .flat()
        .filter(({ vault }) => {
          if (!depositTokenFilter) {
            return true;
          }

          const depositToken = vault.allow_token0
            ? vault.token0_symbol
            : vault.token1_symbol;

          return depositToken
            .toLowerCase()
            .includes(depositTokenFilter.toLowerCase());
        })
        .sort(
          (a, b) =>
            (columns.find((col) => col.key === sorter.key)?.sorter(a, b) ?? 0) *
            (sorter.direction === 'DESC' ? 1 : -1),
        )
    );
  })();

  const loading = !!allVaults.find((v) => v.loading);

  return (
    <>
      <SEOHeader title="Ichi" />
      <Container px="8" py="4" maxW="container.xl">
        <Heading as="h2" fontSize="4xl" color="green.500">
          VAULTS
        </Heading>
        <Flex mt="8">
          <InputGroup variant="filled">
            <InputLeftElement pointerEvents="none">
              <Icon
                as={BsSearch}
                color={colorMode === 'light' ? '#18131b' : 'white'}
              />
            </InputLeftElement>
            <Input
              placeholder="Search by deposit token"
              bg={colorMode === 'dark' ? '#18131b' : 'white'}
              maxW="320px"
              value={depositTokenFilter}
              onChange={(e) => setDepositTokenFilter(e.target.value)}
            />
          </InputGroup>
          <Spacer />
          <RadioGroup
            options={['7 Days', '30 Days', '60 Days']}
            value={`${duration} Days`}
            onChange={(val) => setDuration(parseInt(val.split(' ')[0]))}
          />
        </Flex>
        <TableContainer mt="4">
          <Table
            variant="unstyled"
            sx={{
              borderCollapse: 'separate',
              borderSpacing: '0 var(--chakra-space-2)',
            }}
          >
            <Thead>
              <Tr>
                {columns.map((col) => (
                  <Th
                    key={col.key}
                    fontWeight={sorter.key !== col.key ? 400 : undefined}
                    cursor="pointer"
                    onClick={() => {
                      if (sorter.key === col.key) {
                        setSorter({
                          key: col.key,
                          direction:
                            sorter.direction === 'ASC' ? 'DESC' : 'ASC',
                        });
                      } else {
                        setSorter({
                          key: col.key,
                          direction: 'ASC',
                        });
                      }
                    }}
                  >
                    {col.label}
                    <chakra.span pl="4">
                      {sorter.key === col.key ? (
                        sorter.direction === 'DESC' ? (
                          <Icon
                            as={BsChevronDown}
                            aria-label="sorted descending"
                          />
                        ) : (
                          <Icon
                            as={BsChevronUp}
                            aria-label="sorted ascending"
                          />
                        )
                      ) : (
                        <Icon
                          as={BsChevronExpand}
                          aria-label="sorted ascending"
                        />
                      )}
                    </chakra.span>
                  </Th>
                ))}
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayVaults.map(({ vault, performance, chainId }, index) => (
                <LazyLoad key={index}>
                  <IchiPerformanceCard
                    chainId={chainId}
                    vault={vault}
                    performance={performance}
                    duration={duration}
                  />
                </LazyLoad>
              ))}
            </Tbody>
          </Table>
          {loading &&
            new Array(5)
              .fill(0)
              .map((_, index) => (
                <Skeleton h="88px" mb="2" key={index} rounded="lg" />
              ))}
          {!loading && depositTokenFilter && displayVaults.length === 0 && (
            <Center py="20" px="4">
              <Text>
                No vault found with deposit token like{' '}
                <Text as="span" fontWeight="bold">
                  &apos;{depositTokenFilter}&apos;
                </Text>
              </Text>
            </Center>
          )}
        </TableContainer>
      </Container>
    </>
  );
}
