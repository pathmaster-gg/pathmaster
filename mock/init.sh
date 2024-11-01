#!/bin/sh

set -e

if [ -z "$1" ]; then
  echo "Session token not set" >&2
  exit 1
fi

TOKEN="$1"

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_kingmaker.jpg

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Kingmaker",
  "cover_image_id": 1
}'
