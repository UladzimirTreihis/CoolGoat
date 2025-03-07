# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your config files to the container
COPY config ./config

# Copy everything from your local src directory to the container's src directory
COPY src ./src

# Copy the knexfile.js to the container
COPY knexfile.js ./knexfile.js

# Copy migration files
COPY migrations ./migrations

COPY jobs ./jobs

# Install Knex globally for running migrations
RUN npm install -g knex

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app or mqtt based on environment
CMD ["sh", "-c", "sleep 10 && if [ \"$RUN_MQTT\" = \"true\" ]; then node src/services/mqttServer.js; else node src/server.js; fi"]