import {
  Heading,
  Stack,
  Spacer,
  Menu,
  MenuButton,
  Button,
  Icon,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Center,
} from '@chakra-ui/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useMemo, useState } from 'react';

import { Card } from '~/components/base';
import BarChart from '~/components/shared/Charts/BarChart';
import { ModelMetadata, ModelRuntime, ModelRuntimeStat } from '~/types/model';

import { tooltipFormatter } from './utils';

interface ModelsRuntimeCardProps {
  modelsMetadata: ModelMetadata[];
  loading: boolean;
  modelsRuntime: ModelRuntime[];
  error?: string;
}

export default function ModelsRuntimeCard({
  modelsMetadata,
  loading,
  modelsRuntime,
}: ModelsRuntimeCardProps) {
  const [showLess, setShowLess] = useState(true);
  const [stat, setStat] = useState<ModelRuntimeStat>('mean');

  const tooltip = useMemo(
    () => tooltipFormatter(modelsMetadata),
    [modelsMetadata],
  );

  const data = useMemo(() => {
    return [
      ...modelsRuntime.map((data) => ({
        value: data[stat],
        category: data?.slug,
      })),
    ]
      .sort((a, b) => b.value - a.value)
      .slice(0, showLess ? 10 : Infinity);
  }, [modelsRuntime, stat, showLess]);

  return (
    <Card mt="8" px="6" py="4">
      <Heading as="h2" fontSize="3xl" mb="8">
        Individual Model Runtime Stats
      </Heading>
      <Stack direction={{ base: 'column', lg: 'row' }} mb="4" spacing="4">
        <Spacer />
        <Menu>
          <MenuButton
            alignSelf="center"
            as={Button}
            variant="outline"
            colorScheme="gray"
            size="sm"
            leftIcon={<Icon as={SettingsIcon} />}
          >
            Stat
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuOptionGroup
              type="radio"
              value={stat}
              onChange={(value) => setStat(value as ModelRuntimeStat)}
            >
              <MenuItemOption value="min">Min</MenuItemOption>
              <MenuItemOption value="max">Max</MenuItemOption>
              <MenuItemOption value="mean">Mean</MenuItemOption>
              <MenuItemOption value="median">Median</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Stack>
      <BarChart
        loading={loading}
        data={data}
        height={Math.max(data.length * 32, 335)}
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
