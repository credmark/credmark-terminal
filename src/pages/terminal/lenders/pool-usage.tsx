import { AspectRatio } from '@chakra-ui/react';
import React from 'react';

export default function DashboardPage() {
  return (
    <AspectRatio maxW="100vw" ratio={{ base: 1, lg: 4 / 3, xl: 16 / 9 }}>
      <iframe
        title="AAVE and  COMPOUND Dashboard - Credmark"
        width="600"
        height="373.5"
        src="https://app.powerbi.com/view?r=eyJrIjoiMWE4OWZjZDctMmY3Ny00YzhkLTgzNmQtMzJiM2ExZmZlYTgyIiwidCI6ImZlMjVkZDFmLTFjODktNDBhYi04ODdiLWQzYmY2ZjA2MjI5MyIsImMiOjEwfQ%3D%3D&pageName=ReportSection4905e1a3806dde42e208"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </AspectRatio>
  );
}
