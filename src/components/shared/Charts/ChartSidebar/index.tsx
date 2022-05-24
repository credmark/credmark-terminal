import { Box, useMediaQuery } from '@chakra-ui/react';
import React from 'react';

interface ChartSidebarProps {
  content: React.ReactNode;
}
const ChartSidebar = ({ content }: ChartSidebarProps) => {
  const [isLargerThan600px] = useMediaQuery('(min-width: 600px)');

  return (
    <Box
      width={isLargerThan600px ? '140px' : '100px'}
      borderRight="2px"
      borderColor="#DEDEDE"
    >
      {content}
    </Box>
  );
};

export default ChartSidebar;
