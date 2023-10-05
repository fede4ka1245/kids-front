#!/bin/bash

for i in "$@"; do
  case $i in
  -e=* | --env=*)
    ENV="${i#*=}"
    shift
    ;;
  -*)
    echo "Unknown option $i"
    exit 1
    ;;
  *) ;;
  esac
done

CONFIGS="-f docker-compose.yaml"
if [[ $ENV ]]; then
  CONFIGS="${CONFIGS} -f docker-compose.$ENV.yaml"
fi

# shellcheck disable=SC2086
docker compose ${CONFIGS} up -d --build
