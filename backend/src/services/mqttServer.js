import mqttApp from './mqttApp.js';
import { mqttConfig } from '../../config/config.js'
import client from './mqttService.js'; // Ensure this triggers the MQTT connection


mqttApp.listen(mqttConfig.apiPort, () => {
    console.log(`MQTT service API running on port ${mqttConfig.apiPort}`);
});
