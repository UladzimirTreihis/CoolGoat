import express from 'express';
import cors from 'cors';
import { handleBondRequest } from './handleBondRequest.js'
import { handlePostValidation } from './handlePostValidation.js'

const mqttApp = express();
mqttApp.use(cors());
mqttApp.use(express.json());

mqttApp.post('/mqtt/bonds/postRequest', async (req, res) => {
    try {
        const bondRequestSubmitted = req.body;
        await handleBondRequest(bondRequestSubmitted); // Process the bond request
        res.status(201).json({ 
            message: 'Bond request processed successfully'
        });
    } catch (err) {
        console.error('Error handling bond request:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

mqttApp.post('/mqtt/bonds/postValidation', async (req, res) => {
    try {
        const bondValidationSubmitted = req.body;
        await handlePostValidation(bondValidationSubmitted); // Process the bond request
        res.status(201).json({ 
            message: 'Bond validation processed successfully'
        });
    } catch (err) {
        console.error('Error handling bond validation:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default mqttApp;
