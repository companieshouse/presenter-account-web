#!/bin/bash
# Start script for presenter-account-web
npm ci
PORT=3000
export NODE_PORT=${PORT}
exec npm run dev -- ${PORT}