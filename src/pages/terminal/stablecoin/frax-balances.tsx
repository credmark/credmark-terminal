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
          src="https://app.powerbi.com/view?r=eyJrIjoiNzFmMjNmZDYtY2VjYy00NDcyLTgxOTUtNDc1ZGFiODAzOTk1IiwidCI6ImZlMjVkZDFmLTFjODktNDBhYi04ODdiLWQzYmY2ZjA2MjI5MyIsImMiOjEwfQ%3D%3D&pageName=ReportSectionfe99243aa16623f527c0"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </AspectRatio>
    </>
  );
}
