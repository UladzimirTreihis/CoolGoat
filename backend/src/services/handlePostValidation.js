import client from './mqttService.js';

// Handle bond purchase requests from users
export async function handlePostValidation(bondValidation) {

    try {

        // Publish the bond request to the /requests channel
        client.publish('fixtures/validation', JSON.stringify(bondValidation), (err) => {
            if (err) {
                console.error('Error publishing bond validation to /validations channel:', err);
            } else {
                console.log(`Bond validation for ${bondValidation.request_id} successfully sent to /validation channel.`);
            }
        });

    } catch (err) {
        console.error('Error handling bond request:', err);
        throw err;
    }
}