const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/crypto');

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, address, phone, creditCard, cvv, isAdmin } = req.body;

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = new User({
            name: await encrypt(name),
            email,
            password: hashedPassword,
            address: await encrypt(address),
            phone: await encrypt(phone),
            creditCard: await encrypt(creditCard),
            cvv: await encrypt(cvv),
            history: [],
            isAdmin: isAdmin || false
        });

        await user.save();
        res.status(201).json({ message: 'User saved securely' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message || 'Registration failed' });
    }
});

router.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
        name: decrypt(user.name),
        address: decrypt(user.address),
        phone: decrypt(user.phone),
        history: user.history,
        isAdmin: user.isAdmin
    });
});

module.exports = router;
