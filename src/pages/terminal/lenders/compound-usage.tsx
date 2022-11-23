import { AspectRatio } from '@chakra-ui/react';
import React from 'react';

import SEOHeader from '~/components/shared/SEOHeader';

export default function DashboardPage() {
  return (
    <>
      <SEOHeader title="Compound Lending Usage" />
      <AspectRatio maxW="100vw" ratio={{ base: 1, lg: 4 / 3, xl: 16 / 9 }}>
        <iframe
          title="Compound Lending Usage"
          width="600"
          height="373.5"
          src="https://app.powerbi.com/view?r=eyJrIjoiYmE2ZDA0MzktNTA4Zi00ZjhiLTg5YTMtNjAyMjVjODQwNWNhIiwidCI6ImZlMjVkZDFmLTFjODktNDBhYi04ODdiLWQzYmY2ZjA2MjI5MyIsImMiOjEwfQ%3D%3D"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </AspectRatio>
    </>
  );
}
