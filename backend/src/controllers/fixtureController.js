import Fixture from '../models/Fixture.js';

// Get all fixtures with optional filters and pagination
export const getAllFixtures = async (req, res) => {
    const { page = 1, count = 25, home, away, date } = req.query;

    try {
        const { fixtures, total, totalPages } = await Fixture.findAll({ page, count, home, away, date });
        res.json({ fixtures, total, totalPages });
    } catch (err) {
        console.error('Error retrieving fixtures:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFixtureById = async (req, res) => {
    const { id } = req.params;
    try {
        const fixture = await Fixture.findById(id);
        if (!fixture) {
            return res.status(404).json({ message: 'Fixture not found' });
        }
        res.json(fixture);
    } catch (err) {
        console.error('Error retrieving fixture:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// export const filterFixtures = (req, res) => {
//     const { home, visit, date } = req.query;
//     console.log(`Filtering fixtures with criteria: home=${home}, visit=${visit}, date=${date}`);
//     const criteria = { home, visit, date };
//     Fixture.filter(criteria)
//         .then(fixtures => {
//             console.log(`Returning ${fixtures.length} filtered fixtures`);
//             res.json(fixtures);
//         })
//         .catch(err => {
//             console.error('Error filtering fixtures:', err);
//             res.status(500).send(err);
//         });
// };
