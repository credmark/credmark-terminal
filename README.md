# Credmark App


## Development

`npm install`

Create a env file at `env/.env.local` with these required params:

- NEXT_PUBLIC_HOST
- NEXT_PUBLIC_INFURA_KEY
- NEXT_PUBLIC_FORMATIC_KEY
- NEXT_PUBLIC_PORTIS_ID
- NEXT_PUBLIC_COINBASE_LINK
- NEXT_PUBLIC_BETA

Run `npm start` to start the UI at `http://localhost:3000`

### Post Build to generate sitemap
1. You probably need to create a config file manually for windows, seems to fail on windows but should be okay on linux.
Filename: `next-sitemap.config.js` within your root directory.

2. Generate the sitemap: `npm run postbuild`

## Deployment (Production/Staging)

Create a env file at `env/.env.production` or `env/.env.staging` with the same required params as development. Along with the following optional params:

- NEXT_PUBLIC_GA_TRACKING_ID
- NEXT_PUBLIC_HOTJAR_ID

Run `npm run build:production` or `npm run build:staging` to compile and `npm run staging` or `npm run production` to start UI in production mode.

## AWS Elastic Beanstalk

Execute `./build-prod.sh` to create a zip bundle compatible with AWS EBS.


# Using storybook
We recommend using storybook to develop the UI. This is a good way to showcase the UI and develop the app and also to test the app, as we get it into its own component library in due course.

All UI components are documented in the [Credmark's App Designs on Figma](https://www.figma.com/file/8Bfv8YaIytQwkIih6qeMxn/Design%2FApp?node-id=5%3A3). 

## Reading materials
1. https://storybook.js.org/docs/react/get-started/introduction
2. https://storybook.js.org/docs/react/configure/theming
3. https://storybook.js.org/addons/@chakra-ui/storybook-addon

## Folder structure
Core sections of interest for developing our stories: 
```
.
├── .storybook               // contains storybook configuration
├── pages/stories            // contains stories that are used in the UI
├── src/components/base      // contains base chakra ui before we start customizing
├── src/components/shared    // contains shared customized components 
├── src/theme                // contains shared theme

```

## Commands
First you need to run the project
```
yarn start
npm run start
```
 Then you can run the storybook
```
yarn storybook
npm run storybook
```



