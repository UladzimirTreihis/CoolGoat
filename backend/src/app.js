// YA NO SON NECESARIAS LAS RUTAS DE LOGIN Y SIGNUP
import express from 'express';
import fixturesRoutes from './routes/fixtureRoutes.js';
import authenticationRoutes from './routes/authenticationRoutes.js';
import bondRoutes from './routes/bondRoutes.js'
import walletRoutes from './routes/walletRoutes.js'
import webpayRoutes from './routes/webpayRoutes.js';
import workerRoutes from './routes/workerRoutes.js'
import recommendationRoutes from './routes/recommendationRoutes.js';
import cors from 'cors';
import { serverConfig } from '../config/config.js';
import billRoutes from './routes/billRoutes.js';

const app = express();
app.use(cors())

app.use(express.json());
app.use('/api', fixturesRoutes);
app.use('/api/bonds', bondRoutes);
app.use('/api', walletRoutes);
app.use('/api', webpayRoutes);
app.use('/api', workerRoutes);
app.use('/api', recommendationRoutes);
app.use('/api', billRoutes);
//Use local auth for development, lambda for deployment
if (serverConfig.development === 'true') {
    app.use('/auth', authenticationRoutes);
}

export default app;
