import { AspectRatio } from '@chakra-ui/react';
import React from 'react';

import SEOHeader from '~/components/shared/SEOHeader';

export default function DashboardPage() {
  return (
    <>
      <SEOHeader title="AAVE Lending Usage" />
      <AspectRatio maxW="100vw" ratio={{ base: 1, lg: 4 / 3, xl: 16 / 9 }}>
        <iframe
          title="AAVE Lending Usage"
          width="600"
          height="373.5"
          src="https://app.powerbi.com/view?r=eyJrIjoiNjY3ZTZlNDEtYjczNi00YWFlLWE0ZTItMDhjZDY5NDcxMTE1IiwidCI6ImZlMjVkZDFmLTFjODktNDBhYi04ODdiLWQzYmY2ZjA2MjI5MyIsImMiOjEwfQ%3D%3D"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </AspectRatio>
    </>
  );
}
