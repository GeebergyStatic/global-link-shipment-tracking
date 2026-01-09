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
        const { walletAddress, coinType, qrCodeImage } = req.body;

        if (!walletAddress || !coinType || !qrCodeImage) {
            return res.status(400).json({ message: 'All crypto fields are required.' });
        }

        // Find existing payment by wallet address
        let payment = await Payment.findOne({ 'crypto.address': walletAddress });

        if (!payment) {
            // Create new payment
            payment = new Payment({
                crypto: {
                    address: walletAddress,
                    coinType,
                    qrUrl: qrCodeImage
                }
            });
        } else {
            // Update existing payment
            payment.crypto.address = walletAddress;
            payment.crypto.coinType = coinType;
            payment.crypto.qrUrl = qrCodeImage;
        }

        await payment.save();
        res.json(payment);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save crypto payment.', error: err.message });
    }
});


module.exports = router;