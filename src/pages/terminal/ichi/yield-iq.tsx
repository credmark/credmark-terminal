import {
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Skeleton,
  Spacer,
  useBreakpointValue,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import React, { useEffect, useMemo, useState } from 'react';
import { BsGrid, BsViewList } from 'react-icons/bs';

import IchiPerformanceCard, {
  IchiVault,
} from '~/components/pages/Terminal/IchiPerformanceCard';
import LazyLoad from '~/components/shared/LazyLoad';
import SEOHeader from '~/components/shared/SEOHeader';
import { useModelRunner } from '~/hooks/useModel';

interface BlockNumberOutput {
  blockNumber: number;
  blockTimestamp: number;
  sampleTimestamp: number;
}

export default function IchiYieldIQPage() {
  const isMobile = useBreakpointValue<boolean>({ base: true, xl: false });
  const [selectedLayout, setLayout] = useState<'list' | 'grid'>(
    (localStorage.getItem('preferred_layout') as 'list' | 'grid' | undefined) ??
      'grid',
  );

  useEffect(() => {
    localStorage.setItem('preferred_layout', selectedLayout);
  }, [selectedLayout]);

  const layout = useMemo(
    () => (isMobile ? 'grid' : selectedLayout),
    [isMobile, selectedLayout],
  );

  const blockNumberModel = useModelRunner<BlockNumberOutput>({
    chainId: 137,
    slug: 'ichi/rpc.get-blocknumber',
    input: { timestamp: DateTime.utc().startOf('day').toSeconds() },
  });

  const vaultsModel = useModelRunner<{
    vaults: Record<string, IchiVault>;
  }>({
    chainId: 137,
    slug: 'ichi/ichi.vaults',
    input: {},
    suspended: !blockNumberModel.output,
    blockNumber: blockNumberModel.output?.blockNumber,
  });

  const loading =
    (blockNumberModel.loading || vaultsModel.loading) && !vaultsModel.output;

  return (
    <>
      <SEOHeader title="Ichi" />
      <Container px="8" py="4" maxW="container.xl">
        <Flex mt="4">
          <Heading as="h2" fontSize="4xl" color="green.500">
            Deposit Tokens
          </Heading>
          <Spacer />
          {!isMobile && (
            <>
              <IconButton
                icon={<Icon as={BsViewList} />}
                aria-label="List View"
                variant="ghost"
                colorScheme={selectedLayout === 'list' ? undefined : 'gray'}
                onClick={() => setLayout('list')}
              />
              <IconButton
                icon={<Icon as={BsGrid} />}
                aria-label="Grid View"
                variant="ghost"
                colorScheme={selectedLayout === 'grid' ? undefined : 'gray'}
                onClick={() => setLayout('grid')}
              />
            </>
          )}
        </Flex>
        <Grid
          templateColumns={{
            base: '1fr',
            md: layout === 'grid' ? 'repeat(2, 1fr)' : '1fr',
          }}
          gap="8"
          mt="6"
          mb="16"
        >
          {loading
            ? new Array(4)
                .fill(0)
                .map((_, index) => (
                  <Skeleton
                    h={layout === 'grid' ? '551px' : '177px'}
                    key={index}
                    rounded="lg"
                  />
                ))
            : Object.values(vaultsModel.output?.vaults ?? {}).map((vault) => (
                <GridItem key={vault.vault} minW="0" colSpan={1}>
                  <LazyLoad
                    placeholder={
                      <Skeleton h={layout === 'grid' ? '551px' : '177px'} />
                    }
                  >
                    <IchiPerformanceCard
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      blockNumber={blockNumberModel.output!.blockNumber}
                      vault={vault}
                      layout={layout}
                    />
                  </LazyLoad>
                </GridItem>
              ))}
        </Grid>
      </Container>
    </>
  );
}
