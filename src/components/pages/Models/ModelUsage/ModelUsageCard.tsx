import { Heading, Box } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

import { Card } from '~/components/base';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import SearchSelect from '~/components/shared/Form/SearchSelect';
import { ChartLine } from '~/types/chart';
import { ModelUsage } from '~/types/model';
import { shortenNumber } from '~/utils/formatTokenAmount';

const ALL_MODELS = 'All Models';

interface ModelUsageCardProps {
  loading: boolean;
  error?: string;
  modelsUsage: ModelUsage[];
}

export default function ModelUsageCard({
  loading,
  modelsUsage,
}: ModelUsageCardProps) {
  const [slug, setSlug] = useState(ALL_MODELS);

  const lines = useMemo(() => {
    const slugLineMap: Record<string, ChartLine> = {};
    const allModelsDataMap: Record<number, ChartLine['data'][0]> = {};

    for (const usage of modelsUsage) {
      if (!(usage.slug in slugLineMap)) {
        slugLineMap[usage.slug] = {
          name: usage.slug,
          color: '#A200FF',
          data: [],
        };
      }

      const timestamp = new Date(usage.ts);
      const value = Number(usage.count);
      slugLineMap[usage.slug].data.push({
        timestamp,
        value,
      });

      if (!(timestamp.valueOf() in allModelsDataMap)) {
        allModelsDataMap[timestamp.valueOf()] = { timestamp, value: 0 };
      }

      allModelsDataMap[timestamp.valueOf()].value += value;
    }

    return [
      {
        name: ALL_MODELS,
        color: '#A200FF',
        data: Object.values(allModelsDataMap),
      },
      ...Object.values(slugLineMap),
    ];
  }, [modelsUsage]);

  return (
    <Card px="6" py="4">
      <Heading as="h2" fontSize="3xl" mb="8">
        Historical API Calls
      </Heading>
      <Box maxW="480px">
        <SearchSelect<ChartLine>
          placeholder={loading ? 'Loading Models...' : 'Select a Model...'}
          options={lines}
          filterOption={(option, filterValue) =>
            option.data.name
              .toLocaleLowerCase()
              .includes(filterValue.toLocaleLowerCase().trim())
          }
          getOptionLabel={(option) => option.name}
          value={lines.find((line) => line.name === slug)}
          onChange={(val) => setSlug(val?.name ?? '')}
          isOptionSelected={(option) => slug === option.name}
        />
      </Box>
      <HistoricalChart
        loading={loading}
        lines={lines.filter((line) => line.name === slug)}
        height={335}
        formatYLabel={(value) => shortenNumber(Number(value), 0)}
        formatValue={(value) => new Intl.NumberFormat().format(value)}
        durations={[30, 60, 90]}
        defaultDuration={90}
        aggregate
      />
    </Card>
  );
}
