#!/bin/sh

set -e

/app/node_modules/.bin/wrangler d1 execute \
  --local \
  --file ./db/initialize.sql \
  pathmaster-dev

exec /app/node_modules/.bin/wrangler dev --ip 0.0.0.0
