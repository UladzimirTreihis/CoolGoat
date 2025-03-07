import Wallet from '../models/Wallet.js';
import { mqttConfig } from '../../config/config.js';
import { getUserIdFromScopes } from '../utils/authUtils.js';
import BondRequest from '../models/BondRequest.js'; 
import Fixture from '../models/Fixture.js';
import sendJobToJobsMaster from '../utils/sendJobToJobsMaster.js'


// Controller for fetching all bond requests
export const getAllBonds = async (req, res) => {
    try {
        const bonds = await BondRequest.findAll();
        return res.status(200).json(bonds);
    } catch (err) {
        console.error('Error fetching bonds:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Controller for fetching all bond requests for a given user
export const getUserBonds = async (req, res) => {
    const userId = getUserIdFromScopes(req);
    try {
        const bonds = await BondRequest.findBondsByUserID(userId);
        return res.status(200).json(bonds);
    } catch (err) {
        console.error('Error fetching bonds:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Controller for fetching a bond by ID
export const getBondById = async (req, res) => {
    const { id } = req.params;

    try {
        const bond = await BondRequest.findById(id);
        if (!bond) {
            return res.status(404).json({ message: 'Bond not found' });
        }
        return res.status(200).json(bond);
    } catch (err) {
        console.error('Error fetching bond:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Controller for creating a bond request
export const createBondRequest = async (req, res) => {
    const { fixture_id, group_id, league_name, round, date, result, quantity, odds_name, wallet, deposit_token, buy_order, user_ip } = req.body;
    const user_id = getUserIdFromScopes(req);
    const bondPrice = 1000;

    try {

        if (wallet) {
            // Handle wallet payments

            // Check if user has enough balance
            const userBalance = await Wallet.getBalance(user_id);
            const totalAmount = quantity * bondPrice;

            if (userBalance < totalAmount) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            // Fetch odds for the fixture using Fixture.getOdds
            const odds_values = await Fixture.getOdds(fixture_id, odds_name);
            if (!odds_name) {
                console.error(`Odds not found for fixture ${fixture_id}`);
                throw new Error('Odds not found');
            }

            // Parse user data into a bond request object
            const bondRequestData = {
                fixture_id,
                user_id,
                group_id,
                league_name,
                round,
                date,
                result,
                quantity,
                seller: 0,  // Assuming seller is always 0 for now
                odds_name: odds_name, // Link the odds to the bond request,
                odds_values: odds_values,
                wallet
            };


            const bondRequest = await BondRequest.create(bondRequestData);

            // Send bond request to the MQTT service via HTTP
            const response = await fetch(`http://${mqttConfig.container}:${mqttConfig.apiPort}/mqtt/bonds/postRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bondRequest),
            }
            );

            const data = await response.json();
            if (!response.ok) {
              return res.status(response.status).json({ message: data.message || 'MQTT service error' });
            }


            // Deduct the amount from user's balance and update the balance
            await Wallet.decreaseBalanceBy(user_id, totalAmount);

            // Record the transaction as pending
            const transaction = await Wallet.createTransaction({
                user_id,
                amount: totalAmount,
                request_id: bondRequest.id,  // Link the transaction to the bond request
                type: 'bond_purchase',
                status: 'pending'
            });

            return res.status(201).json({
                message: 'Bond request created successfully',
                bondRequest: bondRequest,
                transaction: transaction
            });


        } else {
            // Handle webpay payments

        }

        
    } catch (err) {
        console.error('Error creating bond request:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};