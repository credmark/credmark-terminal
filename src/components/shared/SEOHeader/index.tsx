import { NextSeo } from 'next-seo';
import React from 'react';

import env from '~/env';

interface SEOHeaderProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}
const SEOHeader = ({
  url = 'https://app.credmark.com/',
  title = 'Credmark App',
  image = `${env?.host}/img/credmark-wallpaper.jpg`,
  description = 'Credmark is a financial modeling platform powered by reliable on-chain data. Validated models are readily composable making rapid prototyping simple.',
}: SEOHeaderProps) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        type: 'website',
        locale: 'en_US',
        url: 'https://app.credmark.com',
        title,
        description,
        images: [
          {
            url: image,
            width: 800,
            height: 450,
            alt: 'Credmark',
          },
        ],
        site_name: 'GaryMeehan.ie',
        defaultImageWidth: 1200,
        defaultImageHeight: 630,
      }}
      twitter={{
        handle: '@credmarkhq',
        site: 'https://twitter.com/credmarkhq',
        cardType: 'summary_large_image',
      }}
    />
  );
};

export default SEOHeader;
