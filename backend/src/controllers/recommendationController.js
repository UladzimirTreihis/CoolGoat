import Recommendation from '../models/Recommendation.js';
import { getUserIdFromScopes } from '../utils/authUtils.js';



export const getHeartBeat = async (req, res) => {
    try {
        const response = await fetch(`http://jobs-master:3004/heartbeat`, {
            method: 'GET',
        });

        // Procesar la respuesta como JSON
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }

        const heartbeat = await response.json(); // Convertir la respuesta en JSON

        return res.status(200).json(heartbeat);
    } catch (err) {
        console.error('Error Getting HeartBeat:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getRecommendedFixtures = async (req, res) => {
    const user_id = getUserIdFromScopes(req);
    console.log(user_id);

    try {
        const { fixtures, lastUpdate } = await Recommendation.getRecommendedFixtures(user_id);
        return res.status(200).json({ fixtures, lastUpdate });
    } catch (err) {
        console.error('Error retrieving recommended fixtures:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const addRecommendation = async (req, res) => {
    console.log("ENTRADA");
    console.log(req.body);
    const { user_id, fixture_id } = req.body;
    console.log(user_id, fixture_id);

    try {
        const recommendationId = await Recommendation.create({ user_id, fixture_id });
        return res.status(201).json({ id: recommendationId });
    } catch (err) {
        console.error('Error adding recommendation:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}