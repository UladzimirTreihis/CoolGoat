// controllers/matchController.js
import Worker from '../models/Worker.js'

export const getUpcomingMatches = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const matches = await Worker.getUpcomingMatches(userId);
        res.status(200).json(matches);
    } catch (error) {
        console.error("Error fetching upcoming matches:", error);
        res.status(500).json({ message: "Server error" });
    }
};
