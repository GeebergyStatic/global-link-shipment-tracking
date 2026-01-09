const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// GET current payment details
router.get('/', async (req, res) => {
    try {
        const payment = await Payment.getInstance();
        res.json(payment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update payment details
router.put('/', async (req, res) => {
    try {
        const payment = await Payment.getInstance();
        if (req.body.crypto) {
            payment.crypto.address = req.body.crypto.address || payment.crypto.address;
            payment.crypto.qrUrl = req.body.crypto.qrUrl || payment.crypto.qrUrl;
        }
        await payment.save();
        res.json(payment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;