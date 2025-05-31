const { User } = require('./../models/User')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({ 
                message: 'Username, password, and email are required' 
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({
            name: username,
            email: email,
            password: password,
            role: role || 'member', // Changed from 'user' to 'member' to match database constraint
            created_at: new Date()
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: error.errors ? error.errors.map((e) => e.message) : null,
        });
    }
})

module.exports = router;