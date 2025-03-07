#!/bin/bash

echo "Pulling application"
cd /home/ubuntu/e1-grupo3-backend
docker compose --file docker-compose.production.yml pull