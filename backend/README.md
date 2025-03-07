# e1-grupo3-backend

## Getting Started Locally

### Set up from 0

1. Install postgres, node
2. git clone the repository
3. Set up a postgres user and the database (variable names in this example are from config.js, which are based on .env; but feel free to use own creds for local test databases)

```bash
sudo -u postgres psql
```

Now you are inside the postgres command line

```sql
CREATE ROLE your_username WITH LOGIN PASSWORD 'your_password';
ALTER ROLE your_username CREATEDB;
CREATE DATABASE your_database;
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_username;
\c your_database;
GRANT ALL ON SCHEMA public TO your_username;
\q
```

Now you are back to your bash command line

4. Navigate to the repository 
5. Install dependancies
```bash
npm install
```

### Continuing 

6. Run the application: the application is build to support independent from each other servises (mqtt and the main app), hence you will need to seperate terminal bash instances

i. Run the mqtt
```bash
node src/services/mqttServer.js
```

ii. Run the server
```bash
node src/server.js
```

7. Caviat! Migrations

If you want to add any change to the schema folder, follow these steps:

a) You should have knex installed

b) Create a migration file:

```bash
npx knex migrate:make name_that_makes_sense
```

c) Find the new migrtion file in /migrations and update the file to ES6 standard using the script:
```bash
node convertMigrationToES6 ./migrations/date_id_name_that_makes_sense
```

d) Now edit the up and down functions in the file (ask chatGPT if unsure how).

e) Run the migration:

```bash
npx knex migrate:latest
```

8. To check out the api routes documentation, open Postman, navigate to the "Import" button and choose "File" as the import option: api-postman.json.


Perfect!

## Webpay logic

### Flow Diagram

The WebPay integration flow consists of three main components:
1. **Front-end** - User interface handling user actions.
2. **Back-end** - API managing business logic and communication with WebPay.
3. **WebPay Service** - External service handling transaction processing and confirmation.

### Key Components

1. **/purchase/options** - A front-end route where users choose their payment option.
2. **/webpay/purchase** - A back-end route that initiates the purchase request with WebPay.
3. **WebPay Form** - External WebPay form where the user confirms the payment.
4. **WebPay Confirmation** - Handles the response from WebPay upon transaction completion.

---

## Step-by-Step Implementation

### 1. User Initiates Purchase
   - **Frontend**: The user selects their desired items or services and initiates a purchase.
   - **Route**: `/purchase/options`
   - **Action**: User selects WebPay as the payment option.
   - **Files**: PurchaseOptions.jsx

### 2. Request Token from WebPay

   - **Backend Route**: `/webpay/purchase`
   - **Action**: 
      - The backend sends a request to the WebPay API with purchase details.
      - The backend creates a new bond request in the database with an initial status (e.g., “pending”).
   - **Response**:
      - WebPay API returns a transaction token and redirection URL.
      - Backend updates the bond request with the token and redirects the user to the confirmation form.
    - **Files**: webpayController.js (createPurchaseRequest)

### 3. User Confirms the Purchase

   - **Frontend**:
      - The frontend receives the token and redirection URL from the backend.
      - Redirects the user to the WebPay confirmation form, where the user submits their payment.
    - **Files**: WebpayCommit.jsx

### 4. WebPay Processing and Final Confirmation

   - After the user confirms payment, WebPay processes the transaction and returns a status to the frontend.
   - **Backend Route**: `/webpay/commit`
   - **Outcome Scenarios**:
      1. **User Cancels**:
         - **Frontend**: No token is sent to WebPay service.
         - **Backend**: Updates bond request status as “invalid.”
         - **MQTT**: Sends validation with “invalid” status to MQTT service.

      2. **Bank Rejects Payment**:
         - **Frontend**: Receives token but with a “failure” status.
         - **Backend**: Updates bond request status as “invalid.”
         - **MQTT**: Sends validation with “invalid” status to MQTT service.

      3. **Payment Successful**:
         - **Frontend**: Receives token with “success” status.
         - **Backend**: Updates bond request status as “valid.”
         - **MQTT**: Sends validation with “valid” status to MQTT service.

	- **Files**: WebpayComplete.jsx, webpayController.js (commitTransaction)

## File roadmap
```
    src/controllers:
        Contains controller files that handle requests and business logic.
    src/models:
        Contains data models, such as the Fixture model for storing match information.
    src/routes:
        Contains route files, where you define the endpoints and link them to controllers.
    src/services:
        Contains service files for specific logic, like the MQTT service to handle connections and messages.
    src/app.js:
        Sets up the Express app, middleware, and routes.
    src/server.js:
        Starts the server and includes any startup logic.
    src/initDb.js:
        Sript that initiates the database
    src/dropDB.js:
        Script that drops all the tables in the database. Used for testing only to avoid constant migrations.
    config/config.js:
        Contains configuration details like MQTT broker credentials.
    tests:
        Contains test files for unit and integration tests.
    connect.js:
        Simple broker connect script for testing purposes.
```


# Server Setup Instructions

## Get the Elastic IP and Link to the Instance

```bash
ssh -i entrega1_key.pem ubuntu@3.91.119.155  # elastic
ssh -i entrega1_key.pem ubuntu@3.90.236.90   # public
```

## Prepare the Ubuntu System

```bash
sudo apt update -y && sudo apt upgrade -y
```

## Install Docker

Follow the instructions from the Docker documentation: [Install Docker on Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

### Add Docker's Official GPG Key

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

### Add the Docker Repository to Apt Sources

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

### Install Docker

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Start Docker and Enable it to Start at Boot

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

## Clone the Project Repository

```bash
git clone https://github.com/UladzimirTreihis/e1-grupo3-backend.git
cd e1-grupo3-backend
```

## Add Environment Variables

```bash
vi .env
```

## Configure Nginx

Move the Nginx config file:

```bash
sudo cp default /etc/nginx/sites-available/default
```

Then navigate back to the main directory:

```bash
cd ..
```

## Install Nginx

```bash
sudo apt install nginx -y
```

## Install Support for SSL

```bash
sudo apt install certbot python3-certbot-nginx -y
```

## Set Up SSL with Certbot

```bash
sudo certbot --nginx -d 3-91-119-155.sslip.io -d www.3-91-119-155.sslip.io
```

Enter your email as required by Certbot.

## Start Nginx

```bash
sudo systemctl start nginx
```

## Check Nginx Status

```bash
sudo systemctl status nginx
```

## Deploy the Application with Docker Compose

Navigate back to the project directory:

```bash
cd e1-grupo3-backend
```

Run Docker Compose:

```bash
sudo docker compose up -d
```

Run it again to ensure the database starts properly:

```bash
sudo docker compose up -d
```

## Verify the Containers are Running

```bash
sudo docker ps -a
```

## Creación Auth

yarn add jsonwebtoken
yarn add express-jwt
yarn add bcrypt


Se crearon las rutas auth/signup y auth/login. Su lógica se encuentra en authenticationController.js
Se protegió a modo de ejemplo las rutas de fixtureRoutes con jwtMiddleware y una con scope 'user'.

Las funciones para verificar los scopes están en jwt.js

Además se guardan las contraseñas hasheadas con bcrypt:
