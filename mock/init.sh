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

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_hellknight_hill.jpg

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_prey_for_death.jpg

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_ruins_of_gauntlight.jpg

curl "https://pathmaster.gg/api/image/adventure_cover" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  --data-binary @images/cover_the_great_toys_heist.jpg

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Kingmaker",
  "cover_image_id": 1
}'

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Hellknight Hill",
  "cover_image_id": 2
}'

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Prey for Death",
  "cover_image_id": 3
}'

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "Ruins of Gauntlight",
  "cover_image_id": 4
}'

curl "https://pathmaster.gg/api/adventure" \
  --fail \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
  "name": "The Great Toys Heist",
  "cover_image_id": 5
}'
