import { Stack } from '@chakra-ui/react';
import React from 'react';

interface ChartSidebarProps {
  children: React.ReactNode;
}
const ChartSidebar = ({ children }: ChartSidebarProps) => {
  return <Stack>{children}</Stack>;
};

export default ChartSidebar;
