# Credmark Terminal

## Development

`npm install`

Create a env file at `env/.env.local` with these required params:

- GATEWAY_API_KEY ([Credmark DeFi API Key](https://credmark.com/product?defiApi=true#learnMore))

And these optional params:

- GATEWAY_BASE_URL (Defaults to https://gateway.credmark.com/)
- NEXT_PUBLIC_HOST

Following env vars are required when using staking feature

- NEXT_PUBLIC_INFURA_KEY
- NEXT_PUBLIC_FORMATIC_KEY
- NEXT_PUBLIC_PORTIS_ID
- NEXT_PUBLIC_COINBASE_LINK

Run `npm start` to start the UI at `http://localhost:3000`

### Generate sitemap

1. You probably need to create a config file manually for windows, seems to fail on windows but should be okay on linux.
Filename: `next-sitemap.config.js` within your root directory.

2. Generate the sitemap: `npm run postbuild`

## Deployment (Production/Staging)

Create a env file at `env/.env.production` or `env/.env.staging` with the same required params as development. Along with the following optional params:

- NEXT_PUBLIC_GTM_TRACKING_ID (Google tag manager ID)
- NEXT_PUBLIC_HOTJAR_ID (Hotjar ID)

Run `npm run build:production` or `npm run build:staging` to compile and `npm run staging` or `npm run production` to start UI in production mode.

## AWS Elastic Beanstalk

Execute `./build-prod.sh` to create a zip bundle compatible with AWS EBS.
