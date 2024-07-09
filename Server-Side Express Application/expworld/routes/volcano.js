const express = require('express');
const router = express.Router();

const authentication = require('../middleware/authentication.js');

router.get('/countries', async (req, res) => {
    try {
        const queryParams = Object.keys(req.query);
        if (queryParams.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Invalid query parameters. Query parameters are not permitted.'
            });
        }

        const countries = await req.db('data').select('country').distinct();

        countries.sort((a, b) => a.country.localeCompare(b.country));
        const countryList = countries.map(country => country.country);
        
        res.json(countryList);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
        console.log(error);
    }
});

router.get('/volcanoes', async (req, res) => {
    try {
        const queryParams = Object.keys(req.query);
        const validParams = ['country', 'populatedWithin'];
        const invalidParams = queryParams.filter(param => !validParams.includes(param));

        if (invalidParams.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Invalid query parameters. Only country and populatedWithin are permitted.'
            });
        }

        const { country, populatedWithin } = req.query;
        const permitedPopulatedWithin = ['5km', '10km', '30km', '100km'];

        if (!country) {
            return res.status(400).json({
                error: true,
                message: 'Country is a required query parameter.'
            });
        }

        if (populatedWithin && !permitedPopulatedWithin.includes(populatedWithin)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid value for populatedWithin. Only: ' + permitedPopulatedWithin.join(',') + ' are permitted.'
            });
        }

        let query = req.db('data').select('id', 'name', 'country', 'region', 'subregion').where('country', country);

        if (populatedWithin) {
            query = query.andWhere(`population_${populatedWithin}`, '>', 0);
        }

        const volcanoes = await query;
        res.json(volcanoes);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
});

router.get('/volcano/:id', authentication, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: true,
                message: 'Invalid query parameters. Query parameters are not permitted.'
            });
        }

        const volcano = await req.db('data').where({ id }).first();
        if (!volcano) {
            return res.status(404).json({
                error: true,
                message: `Volcano with ID: ${id} not found.`
            });
        }

        if (!req.user) {
            delete volcano.population_5km;
            delete volcano.population_10km;
            delete volcano.population_30km;
            delete volcano.population_100km;
        }

        res.status(200).json(volcano);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
});

router.get('/volcano/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: true,
                message: 'Invalid query parameters. Query parameters are not permitted.'
            });
        }

        const volcano = await req.db('data').where({ id }).first();
        if (!volcano) {
            return res.status(404).json({
                error: true,
                message: `Volcano with ID: ${id} not found.`
            });
        }

        const comments = await req.db('comments').where({ volcanoId: id });
        const averageRating = await req.db('comments').where({ volcanoId: id }).avg('rating as avgRating');

        res.status(200).json({ comments, averageRating: averageRating[0].avgRating });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
});

router.post('/volcano/:id/comment', authentication, async (req, res) => {
    try {
        const { id } = req.params;
        const { comment, rating } = req.body;

        if (!req.user) {
            return res.status(401).json({
                error: true,
                message: 'Authorization header (\'Bearer token\') not found'
            });
        }

        if (!id || !comment || typeof rating !== 'number') {
            return res.status(400).json({
                error: true,
                message: 'Request body incomplete: comment and rating are required.'
            });
        }

        const volcano = await req.db('data').where({ id }).first();
        if (!volcano) {
            return res.status(404).json({
                error: true,
                message: `Volcano with ID: ${id} not found.`
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                error: true,
                message: 'Request body invalid: rating must be an integer between 1 and 5.'
            });
        }

        await req.db('comments').insert({ volcanoId: id, userEmail: req.user.email, comment, rating });

        res.status(201).json({ message: 'Comment successfully added' });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
});

module.exports = router;
