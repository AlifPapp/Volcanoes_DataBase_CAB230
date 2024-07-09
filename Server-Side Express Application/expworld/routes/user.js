const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authentication = require('../middleware/authentication.js');

router.post('/user/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Request body incomplete, both email and password are required'
            });
        }

        const existingUser = await req.db('users').where({ email }).first();
        if (existingUser) {
            return res.status(409).json({
                error: true,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await req.db('users').insert({ email, password: hashedPassword });

        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
});

router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Request body incomplete, both email and password are required'
            });
        }

        const user = await req.db('users').where({ email }).first();
        if (!user) {
            return res.status(401).json({
                error: true,
                message: 'Incorrect email or password'
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                error: true,
                message: 'Incorrect email or password'
            });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, token_type: 'Bearer', expires_in: 86400 });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
});

router.get('/user/:email/profile', authentication, async (req, res) => {
    try {
        const { email } = req.params;

        const User = await req.db('users').where({ email }).first();
        if (!User) {
            return res.status(404).json({
                error: true,
                message: 'User not found'
            });
        }

        if (!req.user || req.user.email !== email) {
            delete User.dob;
            delete User.address;
        }

        res.status(200).json(User);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
});

router.put('/user/:email/profile', authentication, async (req, res) => {
    try {
        const { email } = req.params;
        const { firstName, lastName, dob, address } = req.body;

        if (!req.user) {
            return res.status(401).json({
                error: true,
                message: 'Authorization header (\'Bearer token\') not found'
            });
        }

        if (!firstName || !lastName || !dob || !address) {
            return res.status(400).json({
                error: true,
                message: 'Request body incomplete: firstName, lastName, dob and address are required.'
            });
        }

        if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof address !== 'string') {
            return res.status(400).json({
                error: true,
                message: 'Request body invalid: firstName, lastName and address must be strings only.'
            });
        }

        const ValidDate = (dob) => {
            const dobDate = new Date(dob);
            if (dobDate.toString() === 'Invalid Date') {
                return false;
            }

            const dobSplit = dob.split('-');
            if (dobSplit.length !== 3 || dobSplit[0].length !== 4 || dobSplit[1].length !== 2 || dobSplit[2].length !== 2) {
                return false;
            }

            const year = parseInt(dobSplit[0], 10);
            const month = parseInt(dobSplit[1], 10);
            const day = parseInt(dobSplit[2], 10);
            if (month < 1 || month > 12 || day < 1 || day > 31) {
                return false;
            }

            let LeapYear = false;
            if (year % 4 === 0) {
                if (year % 100 !== 0) {
                    LeapYear = true;
                } else if (year % 400 === 0) {
                    LeapYear = true;
                }
            }
            const MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (LeapYear) {
                MonthDays[1] = 29;
            }

            if (day > MonthDays[month - 1]) {
                return false;
            }

            return true;
        };

        const dobDate = new Date(dob);
        if (!ValidDate(dob)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid input: dob must be a real date in format YYYY-MM-DD.'
            });
        }

        if (dobDate >= new Date()) {
            return res.status(400).json({
                error: true,
                message: 'Invalid input: dob must be a date in the past.'
            });
        }

        if (req.user.email !== email) {
            return res.status(403).json({
                error: true,
                message: 'Forbidden'
            });
        }

        await req.db('users').where({ email }).update({ firstName, lastName, dob, address });

        res.status(200).json({
            email: email,
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            address: address
        });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
        console.log(error);
    }
});


module.exports = router;
