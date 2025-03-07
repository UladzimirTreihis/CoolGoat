import BondRequest from '../models/BondRequest.js'; 
import User from '../models/User.js';
import { getUserIdFromScopes } from '../utils/authUtils.js';

import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });
const lambda = new AWS.Lambda();

export const getBill = async (req, res) => {
    const { id: bond_id } = req.params;
    const user_id = getUserIdFromScopes(req);

    try {
        const bond = await BondRequest.findById(bond_id);
        console.log(bond);
        const user = await User.findById(user_id);

        if (!bond) {
            return res.status(404).json({ message: 'Bond not found' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { datetime, fixture_id, league_name, result, odds_name, quantity, round, seller } = bond;
        const { username, email } = user;

        const billData = {
            datetime,
            fixture_id,
            league_name,
            result,
            odds_name,
            quantity,
            round,
            seller,
            username,
            email
        }

        const body = JSON.stringify(billData);
        console.log('Body:', body);

        const params = {
            FunctionName: "pdf-generator-service-dev-generatePDF",
            InvocationType: "RequestResponse",
            Payload: JSON.stringify(body)
        }

        const response = await lambda.invoke(params).promise();
        const responsePayload = JSON.parse(response.Payload);

        const downloadUrl = JSON.parse(responsePayload.body).downloadUrl;
        console.log(downloadUrl);

        return res.status(200).json({
            message: 'Bill generated',
            url: downloadUrl
        });
    } catch (err) {
        console.error('Error generating bill:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

