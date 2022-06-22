import { NextSeo } from 'next-seo';
import React from 'react';

import env from '~/env';

interface SEOHeaderProps {
  title: string;
  titleTemplate?: string;
  description?: string;
  url?: string;
  image?: string;
}
export default function SEOHeader({
  url = 'https://app.credmark.com/',
  title,
  titleTemplate = '%s | Credmark Terminal - Actionable DeFi Data',
  image = `${env.host}/img/credmark-terminal.png`,
  description = "Analyze lending protocol health and assess crypto risk and reward with a variety of metrics powered by Credmark's API",
}: SEOHeaderProps) {
  return (
    <NextSeo
      title={title}
      titleTemplate={titleTemplate}
      description={description}
      canonical={url}
      openGraph={{
        type: 'website',
        locale: 'en_US',
        url: env.host,
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
        site_name: 'app.credmark.com',
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
}
