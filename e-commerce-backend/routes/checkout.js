const express = require('express');
const router = express.Router();

router.post('/checkout', async (req, res) => {
    try {
        const { cardNumber, cvv } = req.body;

        // Simple validation (in real app, integrate payment gateway)
        if (!cardNumber || !cvv) {
            return res.status(400).json({ error: 'Card number and CVV are required' });
        }

        // Simulate payment success
        res.json({ message: 'Payment successful' });
    } catch (error) {
        res.status(500).json({ error: 'Payment failed' });
    }
});

module.exports = router;
