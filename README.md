# Credmark App

## Development

`npm install`

Create a env file at `env/.env.local` with these required params:

- NEXT_PUBLIC_HOST
- NEXT_PUBLIC_INFURA_KEY
- NEXT_PUBLIC_FORMATIC_KEY
- NEXT_PUBLIC_PORTIS_ID
- NEXT_PUBLIC_COINBASE_LINK

Run `npm start` to start the UI at `http://localhost:3000`

## Deployment (Production/Staging)

Create a env file at `env/.env.production` or `env/.env.staging` with the same required params as development. Along with the following optional params:

- NEXT_PUBLIC_GA_TRACKING_ID
- NEXT_PUBLIC_HOTJAR_ID

Run `npm run build:production` or `npm run build:staging` to compile and `npm run staging` or `npm run production` to start UI in production mode.

## AWS Elastic Beanstalk

Execute `./build-prod.sh` to create a zip bundle compatible with AWS EBS.