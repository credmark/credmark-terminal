import { NextSeo } from 'next-seo';
import React from 'react';

interface SEOHeaderProps {
  title?: string;
  description?: string;
  url?: string;
}
const SEOHeader = ({
  url = 'https://app.credmark.com/',
  title = 'Credmark App',
  description = 'Credmark is a financial modeling platform powered by reliable on-chain data. Validated models are readily composable making rapid prototyping simple.',
}: SEOHeaderProps) => {
  return <NextSeo title={title} description={description} canonical={url} />;
};

export default SEOHeader;
