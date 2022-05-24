import { NextSeo } from 'next-seo';
import React from 'react';

interface SEOHeaderProps {
  title?: string;
  description?: string;
  canonical?: string;
}
const SEOHeader = ({
  canonical = 'https://app.credmark.com/',
  title = 'Credmark',
  description = 'Credmark is a financial modeling platform powered by reliable on-chain data. Validated models are readily composable making rapid prototyping simple.',
}: SEOHeaderProps) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={canonical}
      twitter={{
        handle: '@credmarkhq',
        site: '@credmarkhq',
      }}
    />
  );
};

export default SEOHeader;
