import { tx } from '../utils/trx.js'
import WebpayTransaction from '../models/WebpayTransaction.js';
import { getUserIdFromScopes } from '../utils/authUtils.js';
import BondRequest from '../models/BondRequest.js';
import Fixture from '../models/Fixture.js';
import sendJobToJobsMaster from '../utils/sendJobToJobsMaster.js'
import { mqttConfig } from '../../config/config.js';


export const createPurchaseRequest = async (req, res) => {
  try {
    const { fixture_id, group_id, league_name, round, date, result, quantity, odds_name, wallet, deposit_token, returnUrl, user_ip } = req.body;
    const user_id = getUserIdFromScopes(req);
    const bondPrice = 1000;
    const totalAmount = quantity * bondPrice;
    console.log(returnUrl)

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

    // Create the bond request in the database
    const bondRequest = await BondRequest.create(bondRequestData);

    // Create transaction in DB
    const transactionRecord = await WebpayTransaction.create({
        user_id,
        request_id: bondRequest.id,
        amount: totalAmount
    })

    // Proceed with creating the transaction in Webpay
    const createResponse = await tx.create(transactionRecord.id, String(transactionRecord.user_id), transactionRecord.amount, returnUrl);

    // Send back the token and url
    if (createResponse.token) {

      // Update token
      BondRequest.updateDepositToken(bondRequest.id, createResponse.token)
      WebpayTransaction.updateDepositToken(transactionRecord.id, createResponse.token)

      // Send bond request to the MQTT service via HTTP
      const response = await fetch(`http://${mqttConfig.container}:${mqttConfig.apiPort}/mqtt/bonds/postRequest`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(bondRequest),
      }
      );

      return res.status(200).json({
        token_ws: createResponse.token,
        url: createResponse.url,
      });
    } else {
      return res.status(500).json({ error: 'Failed to communicate with WebPay' });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Failed to create WebPay transaction.' });
  }
};

export const commitTransaction = async (req, res) => {
    try {
        const { token_ws: token } = req.body;

        if (!token || token == "") {
            return res.status(200).json({ 
              message: "Transacion cancelled by user.",
              success: false
            });
        }

        const commitResponse = await tx.commit(token);

        const bondRequest = await BondRequest.findByDepositToken(token)
        const bondValidation = {
          request_id: bondRequest.id,
          group_id: bondRequest.group_id,
          seller: bondRequest.seller,
          valid: NaN
        }

        if (commitResponse.response_code != 0) {
          // Rejected logic
          await WebpayTransaction.updateTransactionStatusByToken(token, "rejected")
          await BondRequest.updateStatusByDepositToken(token, "invalid")
          bondValidation.valid = false

          // Send bond validation to the MQTT service via HTTP
          const response = await fetch(`http://${mqttConfig.container}:${mqttConfig.apiPort}/mqtt/bonds/postValidation`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(bondValidation),
          }
          );

          return res.status(200).json({ 
            message: "Transacion rejected by your bank.",
            success: false
          });
        }

        // Success logic
        await WebpayTransaction.updateTransactionStatusByToken(token, "completed")
        await BondRequest.updateStatusByDepositToken(token, "valid")
        bondValidation.valid = true

        // Send bond validation to the MQTT service via HTTP
        const response = await fetch(`http://${mqttConfig.container}:${mqttConfig.apiPort}/mqtt/bonds/postValidation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bondValidation),
        }
        );

        return res.status(200).json({ 
          message: "Transacion successful.",
          success: true
        });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to commit WebPay transaction.' });
    }
};