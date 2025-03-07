#!/bin/bash

echo "Application starting"
cd /home/ubuntu/e1-grupo3-backend
docker compose --file docker-compose.production.yml up -d
