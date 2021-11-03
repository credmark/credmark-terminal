#!/bin/sh

rm -rf .next
npm run build
now=`date +"%Y%m%d%H%M%S"`
zip awsebs-$now.zip -r .next -r public package.json package-lock.json Procfile