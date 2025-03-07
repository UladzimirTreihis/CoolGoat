import BondRequest from "../models/BondRequest.js";
import Fixture from "../models/Fixture.js";
import Worker from "../models/Worker.js";

const sendJobToJobsMaster = async (userID) => {
    try {

        const matches = await Worker.getUpcomingMatches(userID);
        const userBonds = await BondRequest.findBondsByUserID(userID);
        

        const jobPayload = {
            fixtures: matches,
            bonds: userBonds,
            user_id: userID
        };

        // console.log(JSON.stringify(jobPayload));
        // console.log("aaaaaaa");
        // Hacer la solicitud POST al endpoint /job de jobs-master
        const jobResponse = await fetch(`http://jobs-master:3004/job`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobPayload),
        });

        const jobData = await jobResponse.json();
        if (!jobResponse.ok) {
            console.error('Error llamando al endpoint /job:', jobData.message);
            throw new Error(jobData.message || 'Error en jobs-master');
        }

        console.log(`Job creado con ID: ${jobData.id}`);
        return jobData;
            
    } catch (err) {
        console.error('Error en la función sendJobToJobsMaster:', err);
        throw err;  // Lanza el error para manejarlo en el controlador
    }
};

export default sendJobToJobsMaster;