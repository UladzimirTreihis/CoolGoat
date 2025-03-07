import mqtt from 'mqtt';
import { mqttConfig } from '../../config/config.js';
import { handleFixtureInfo, handleBondRequestReceived, handleBondValidation, handleFixtureHistory } from './mqttHandlers.js';

// Initialize MQTT client
const client = mqtt.connect(`mqtt://${mqttConfig.host}:${mqttConfig.port}`, {
    username: mqttConfig.username,
    password: mqttConfig.password,
});

// Helper function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Connect and subscribe to all topics
client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Subscribe to the relevant topics
    const topics = ['fixtures/info', 'fixtures/requests', 'fixtures/validation', 'fixtures/history'];
    client.subscribe(topics, (err) => {
        if (err) {
            console.error('Subscription error:', err);
        } else {
            console.log(`Subscribed to ${topics.join(', ')}`);
        }
    });
});

// Handle incoming messages
client.on('message', async (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
    const parsedMessage = JSON.parse(message.toString());

    try {
        switch (topic) {
            case 'fixtures/requests':
                await delay(1000)
                await handleBondRequestReceived(parsedMessage);
                break;
            case 'fixtures/info':
                await handleFixtureInfo(JSON.parse(parsedMessage));
                break;
            case 'fixtures/validation':
                await delay(5000)
                await handleBondValidation(parsedMessage);
                break;
            case 'fixtures/history':
                await delay(1000)
                await handleFixtureHistory(JSON.parse(parsedMessage));
                break;
            default:
                console.log('Unknown topic:', topic);
        }
    } catch (err) {
        console.error('Error processing message:', err);
    }
});

export default client;