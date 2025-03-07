import mqtt from 'mqtt'
import express from 'express'

// MQTT Broker details
const HOST = 'broker.iic2173.org';
const PORT = 9000;
const USER = 'students';
const PASSWORD = 'iic2173-2024-2-students';

// Initialize the Express app
const app = express();

// Connect to the MQTT broker
const client = mqtt.connect(`mqtt://${HOST}:${PORT}`, {
  username: USER,
  password: PASSWORD
});

// Handle the connection event
client.on('connect', () => {
  console.log('Connected successfully to MQTT broker');
  
  // Example of subscribing to a topic
  client.subscribe('fixtures/history', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to fixtures/history');
    }
  });
});

// Handle incoming messages
client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
});

// Express route example (not required for MQTT, but useful for your API)
app.get('/', (req, res) => {
  res.send('MQTT Client Running');
});

// Start the Express server
app.listen(3000, () => {
  console.log('Express server running on port 3000');
});
