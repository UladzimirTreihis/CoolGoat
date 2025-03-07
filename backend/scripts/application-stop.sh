#!/bin/bash

echo "Stop Application"
cd /home/ubuntu/e1-grupo3-backend
docker compose --file docker-compose.production.yml down