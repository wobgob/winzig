#!/bin/sh

if [ -z "$DISCORD_BOT_TOKEN" ]; then
    echo "DISCORD_BOT_TOKEN not set"
    exit 1
fi

if [ -z "$DATABASE_URI" ]; then
    echo "DATABASE_URI not set"
    exit 1
fi

node /home/node/app/dist/index.js
