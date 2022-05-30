import { AspectRatio } from '@chakra-ui/react';
import React from 'react';

import SEOHeader from '~/components/shared/SEOHeader';

export default function DashboardPage() {
  return (
    <>
      <SEOHeader title="AAVE Lending Pool Usage Terminal" />
      <AspectRatio maxW="100vw" ratio={{ base: 1, lg: 4 / 3, xl: 16 / 9 }}>
        <iframe
          title="AAVE Dashboard - Credmark"
          width="600"
          height="373.5"
          src="https://app.powerbi.com/view?r=eyJrIjoiNmYyMTk0NTctYjAzMC00ZTlmLWFhN2EtNDc5N2UwYTJjYWRjIiwidCI6ImZlMjVkZDFmLTFjODktNDBhYi04ODdiLWQzYmY2ZjA2MjI5MyIsImMiOjEwfQ%3D%3D&pageName=ReportSection4905e1a3806dde42e208"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </AspectRatio>
    </>
  );
}
