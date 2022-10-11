import { Heading, Center, Button, Icon } from '@chakra-ui/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useMemo, useState } from 'react';

import { Card } from '~/components/base';
import BarChart from '~/components/shared/Charts/BarChart';
import { ModelMetadata, TopModel } from '~/types/model';

import { tooltipFormatter } from './utils';

interface TopModelsCardProps {
  modelsMetadata: ModelMetadata[];
  loading: boolean;
  topModels: TopModel[];
  error?: string;
}

export default function TopModelsCard({
  modelsMetadata,
  loading,
  topModels,
}: TopModelsCardProps) {
  const [showLess, setShowLess] = useState(true);

  const chartData = useMemo(() => {
    return topModels
      .map((data) => ({
        value: data.count,
        category: data?.slug,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, showLess ? 10 : Infinity);
  }, [topModels, showLess]);

  const tooltip = useMemo(
    () => tooltipFormatter(modelsMetadata),
    [modelsMetadata],
  );

  return (
    <Card mt="8" px="6" py="4">
      <Heading as="h2" fontSize="3xl" mb="8">
        Top Models
      </Heading>

      <BarChart
        loading={loading}
        data={chartData}
        height={Math.max(chartData.length * 32, 335)}
        padding={0}
        tooltipFormatter={tooltip}
      />
      <Center>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowLess(!showLess)}
          rightIcon={
            showLess ? (
              <Icon as={ExpandMoreIcon} />
            ) : (
              <Icon as={ExpandLessIcon} />
            )
          }
        >
          {showLess ? 'Show More' : 'Show Less'}
        </Button>
      </Center>
    </Card>
  );
}
