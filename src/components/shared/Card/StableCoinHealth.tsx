import { Grid, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

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

export default StableCoinHealth;
