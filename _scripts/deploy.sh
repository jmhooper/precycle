#!/bin/bash

S3_BUCKET_NAME="jonathan-hooper-static-sites"
S3_SITE_DIR="precycle.jonathanhooper.net"

# Build if there is no _site directory
if [[ ! -d ./_site ]] ; then
  _scripts/build.sh
fi

# Sync with S3
aws s3 sync ./_site/ s3://$S3_BUCKET_NAME/$S3_SITE_DIR
