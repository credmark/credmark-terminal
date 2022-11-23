import { AspectRatio } from '@chakra-ui/react';
import React from 'react';

import SEOHeader from '~/components/shared/SEOHeader';

export default function DashboardPage() {
  return (
    <>
      <SEOHeader title="FRAX Stats & Collateralization" />
      <AspectRatio maxW="100vw" ratio={{ base: 1, lg: 4 / 3, xl: 16 / 9 }}>
        <iframe
          title="FRAX Stats & Collateralization"
          width="600"
          height="373.5"
          src="https://app.powerbi.com/view?r=eyJrIjoiM2U0Zjg5YWEtZGYyNS00OTUzLTkyODAtZGIxZWRmZWM4NzE1IiwidCI6ImZlMjVkZDFmLTFjODktNDBhYi04ODdiLWQzYmY2ZjA2MjI5MyIsImMiOjEwfQ%3D%3D&pageName=ReportSection132b47907799738c6ae5"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </AspectRatio>
    </>
  );
}
