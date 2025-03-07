import client from './mqttService.js';

// Handle bond purchase requests from users
export async function handleBondRequest(bondRequest) {
    const bondPrice = 1000;

    try {

        // Prepare the bond request object to be sent to the /requests channel
        const bondRequestMessage = {
            request_id: bondRequest.id, // UUID generated when the bondRequest is created
            fixture_id: bondRequest.fixture_id,
            group_id: 3,
            league_name: bondRequest.league_name,
            round: bondRequest.round,
            date: bondRequest.date,
            result: bondRequest.result,
            deposit_token: bondRequest.deposit_token,
            datetime: bondRequest.datetime,  
            quantity: bondRequest.quantity,
            wallet: bondRequest.wallet,
            seller: bondRequest.seller // Always 0 as per current logic
        };

        console.log('Bond request message:', bondRequestMessage);

        // Publish the bond request to the /requests channel
        client.publish('fixtures/requests', JSON.stringify(bondRequestMessage), (err) => {
            if (err) {
                console.error('Error publishing bond request to /requests channel:', err);
            } else {
                console.log(`Bond request ${bondRequest.id} successfully sent to /requests channel.`);
            }
        });

        // Does not have to return anything?
        // return { bondRequest };
    } catch (err) {
        console.error('Error handling bond request:', err);
        throw err;
    }
}