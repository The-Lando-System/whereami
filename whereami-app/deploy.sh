#!/usr/bin/env bash

ERROR=$(ng build --prod 2>&1 >/dev/null)

if [ -z "$ERROR" ]
then
  echo "Build Success!"
  aws s3 rm s3://whereami.voget.io --recursive
  aws s3 cp ./dist/whereami-app/ s3://whereami.voget.io --recursive
else
  echo "$ERROR"
  echo "Build Failed..."
fi