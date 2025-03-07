// mqttHandlers.js: 
// Este archivo se encargará de manejar los mensajes recibidos desde los tópicos de MQTT
import Fixture from '../models/Fixture.js';
import BondValidation from '../models/BondValidation.js';
import BondRequestReceived from '../models/BondRequestReceived.js';
import BondRequest from '../models/BondRequest.js';
import Wallet from '../models/Wallet.js';
import { mqttConfig } from '../../config/config.js';
import { compare } from 'bcrypt';
import sendJobToJobsMaster from './../utils/sendJobToJobsMaster.js'

// Handle fixture info
export async function handleFixtureInfo(message) {
    if (message.fixtures) {
        for (let fixtureData of message.fixtures) {
            await Fixture.create(fixtureData);
        }
    }
}

// Handle bond purchase requests from /requests channel
export async function handleBondRequestReceived(message) {
    const { request_id, fixture_id, group_id, league_name, round, date, result, deposit_token, datetime, quantity, seller } = message;
    try {
        const fixture = await Fixture.findById(fixture_id);
        if (!fixture) {
            console.error(`Fixture ${fixture_id} not found`);
            return;
        }

        const remainingBonds = fixture.fixture.remaining_bonds;
        if (remainingBonds < quantity) {
            console.error(`Not enough bonds remaining for fixture ${fixture_id}`);
            return;
        }

        const newRemainingBonds = remainingBonds - quantity;
        await Fixture.updateRemainingBonds(fixture_id, newRemainingBonds);

        const bondRequest = await BondRequestReceived.create({
            request_id, fixture_id, group_id, league_name, round, date, result, deposit_token, datetime, quantity, seller
        });

        console.log(`Bond request ${request_id} for fixture ${fixture_id} processed. Bonds remaining: ${newRemainingBonds}`);

        return bondRequest;
    } catch (err) {
        console.error('Error handling bond request:', err);
    }
}

// Handle bond validation results from /validation channel
export async function handleBondValidation(message) {
    const { request_id, valid } = message;
    try {
        // Fetch the bond request from BondRequestReceived using request_id
        const bondRequestReceived = await BondRequestReceived.findById(request_id);
        if (!bondRequestReceived) {
            console.error(`Bond request received ${request_id} not found`);
            return;
        }
        const { group_id, fixture_id, quantity } = bondRequestReceived;
        // Check if this request is from our group
        const isOurGroup = group_id === mqttConfig.group_id;
        if (isOurGroup) {
            // Fetch the corresponding bond request from BondRequest table
            const bondRequest = await BondRequest.findById(request_id);
            if (!bondRequest) {
                console.error(`Bond request ${request_id} not found in bond_requests table`);
                return;
            }
            // Find the corresponding transaction
            const transaction = await Wallet.findTransactionByRequestId(request_id);
            if (valid) {
                // Update bond request status to 'valid'
                await BondRequest.updateStatus(request_id, 'valid');
                console.log(`Bond request ${request_id} validated and completed`);
                // Update the transaction status to 'completed'
                await Wallet.updateTransactionStatus(transaction.id, 'completed');
                // Delete bond request from bond_requests_received table
                await BondRequestReceived.delete(request_id);
                
                // Store validation data in BondValidation
                await BondValidation.create({
                    request_id,
                    fixture_id,
                    valid: true
                });

                // Send to the Job Master
                const jobData = await sendJobToJobsMaster(bondRequest.user_id);
            } else {
                // Update bond request status to 'invalid'
                await BondRequest.updateStatus(request_id, 'invalid');
                console.log(`Bond request ${request_id} validation failed`);
                // Return bonds to fixture
                const fixture = await Fixture.findById(fixture_id);
                const newRemainingBonds = fixture.fixture.remaining_bonds + quantity;
                await Fixture.updateRemainingBonds(fixture_id, newRemainingBonds);
                // Update the transaction status to 'rejected'
                await Wallet.updateTransactionStatus(transaction.id, 'rejected');
                // Add the amount back to user's balance
                await Wallet.increaseBalanceBy(bondRequest.user_id, transaction.amount);
                // Delete bond request from bond_requests_received table
                await BondRequestReceived.delete(request_id);
                // Store validation data in BondValidation
                await BondValidation.create({
                    request_id,
                    fixture_id,
                    valid: false
                });
            }
        } else {
            if (valid) {
                // If not our group's request, simply delete bond request from bond_requests_received
                await BondRequestReceived.delete(request_id);
                console.log(`Bond request ${request_id} from another group validated and deleted`);
            } else {
                // Return bonds to fixture
                const fixture = await Fixture.findById(fixture_id);
                const newRemainingBonds = fixture.fixture.remaining_bonds + quantity;
                await Fixture.updateRemainingBonds(fixture_id, newRemainingBonds);
                // Delete bond request from bond_requests_received table
                await BondRequestReceived.delete(request_id);
                console.log(`Bond request ${request_id} from another group invalidated, bonds returned, and request deleted`);
            }
        }
    } catch (err) {
        console.error('Error handling bond validation:', err);
    }
}


// Parse the result based on goals
function parseResult(goals) {
    const { home, away } = goals;
    
    if (home > away) {
        return { name: "Match Winner", result: "Home" };
    } else if (home < away) {
        return { name: "Match Winner", result: "Away" };
    } else {
        return { name: "Match Winner", result: "Draw" };
    }
}

// Handle fixture history
export async function handleFixtureHistory(message) {
    const { fixtures } = message;

    for (const fixture of fixtures) {
        try {
            const { fixture: fixtureDetails, goals } = fixture;
            const { id: fixture_id } = fixtureDetails;

            // Parse the actual result from the fixture
            const parsedResult = parseResult(goals);

            // Fetch all valid bond requests associated with this fixture using the isolated model method
            const bondRequests = await BondRequest.findValidRequestsByFixture(fixture_id);

            // Process each bond request based on the fixture result
            for (const bondRequest of bondRequests) {
                const { id: request_id, user_id, result: predictedResult, quantity, odds_values } = bondRequest;

                // Find the winning odds in the odds JSON
                const winningOdd = odds_values.find(odd => odd.value === parsedResult.result);
                console.log(`
                Bond ${request_id} on Fixture ${fixture_id}: 
                the predited result is ${predictedResult} and the odds values are ${odds_values}. 
                With the result of ${parsedResult.result} and the winningOdd ${winningOdd}`)

                // Match the team name with the outcome
                const fixtureFound = await Fixture.findById(fixture_id)
                let finalResult;
                if (fixtureFound.teams.home.name === predictedResult) {
                    finalResult = "Home"
                } else if (fixtureFound.teams.away.name === predictedResult) {
                    finalResult = "Away"
                } else {
                    finalResult = "Draw"
                }

                // compare finalResult vs parseResult.result

                if (finalResult === parsedResult.result && winningOdd) {
                    // Calculate the win amount
                    const winAmount = winningOdd.odd * quantity * 1000;

                    // Record the transaction as a reward
                    const transaction = await Wallet.createTransaction({
                        user_id,
                        request_id,
                        amount: winAmount,
                        type: 'reward',
                        status: 'completed'
                    });

                    // Increase the user's balance based on the win amount
                    await Wallet.increaseBalanceBy(user_id, winAmount);

                    // Mark the bond request as won
                    await BondRequest.updateStatus(request_id, 'won');

                    console.log(`Bond request ${request_id} for fixture ${fixture_id} won! Reward: ${winAmount}`);
                } else {
                    // Bond request failed, mark as 'lost'
                    await BondRequest.updateStatus(request_id, 'lost');
                    console.log(`Bond request ${request_id} for fixture ${fixture_id} lost.`);
                }
            }

            console.log(`History for fixture ${fixture_id} was considered in updating the bonds.`);
        } catch (err) {
            console.error(`Error updating bond result for fixture ${fixture.fixture_id}:`, err);
        }
    }
}