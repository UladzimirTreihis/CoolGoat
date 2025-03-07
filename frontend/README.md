# e1-grupo3-frontend

# URL: web.coolgoat4444.me

## Getting started locally

1. Clone the repository
2. Install node and npm

## Option 1: Using npm
1. In the project directory, run `npm install` to install all dependencies
2. Run `npm run dev` to start the development server

## Option 2: Using yarn
1. Install yarn by running `npm install -g yarn`
2. In the project directory, run `yarn` to install all dependencies
3. Run `yarn dev` to start the development server

PD: An optional .env file may be used instead of the hardcoded environment vars for the API URL included in config/config.js. The .env file should be placed in the root of the project and should contain the following lines:

```
VITE_BACKEND_HOST='localhost'
VITE_BACKEND_PORT=3000
VITE_DEVELOPMENT=true
```