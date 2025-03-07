import dotenv from 'dotenv'

dotenv.config();

// Define the development configuration
const mqttConfigDevelopment = {
    host: process.env.MQTT_HOST_DEV,
    port: process.env.MQTT_PORT_DEV || 9000,
    username: process.env.MQTT_USER_DEV,
    password: process.env.MQTT_PASSWORD_DEV,
    topic: process.env.MQTT_TOPIC_DEV,
    group_id: process.env.MQTT_GROUP_ID_DEV || 3,
    apiPort: process.env.MQTT_API_PORT_DEV || 3002,
    container: process.env.MQTT_CONTAINER_HOST_DEV || 'localhost'
};

// Define the production configuration
const mqttConfigProduction = {
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    topic: process.env.MQTT_TOPIC,
    group_id: process.env.MQTT_GROUP_ID,
    apiPort: process.env.MQTT_API_PORT,
    container: process.env.MQTT_CONTAINER_HOST
};

// Choose the configuration based on the environment variable
export const mqttConfig = process.env.DEVELOPMENT === 'true' ? mqttConfigDevelopment : mqttConfigProduction;

export const serverConfig = {
    port: process.env.SERVER_PORT || 3000,
    development: process.env.DEVELOPMENT || 'false'
};

// Define the development configuration
const dbConfigDevelopment = {
    user: process.env.DATABASE_USER_DEV,
    host: process.env.DATABASE_HOST_DEV,
    database: process.env.DATABASE_NAME_DEV,
    password: process.env.DATABASE_PASSWORD_DEV,
    port: process.env.DATABASE_PORT_DEV || 5432 // Default port for PostgreSQL
};

// Define the production configuration without fallback values
const dbConfigProduction = {
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT // Ensure all env variables are set
};

// Choose the configuration based on the environment variable
export const dbConfig = process.env.DEVELOPMENT === 'true' ? dbConfigDevelopment : dbConfigProduction;