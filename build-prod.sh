#!/bin/sh

rm -rf .next
npm run build:production
now=`date +"%Y%m%d%H%M%S"`
zip awsebs-$now.zip -r env/.env.production -r .next -r public package.json package-lock.json Procfile