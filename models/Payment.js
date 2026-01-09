const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    crypto: {
        address: { type: String, required: true },
        coinType: { type: String, required: true },  // e.g., BTC, ETH, SOL
        qrUrl: { type: String, required: true }
    }
}, { timestamps: true });

// Singleton pattern: ensures only one payment document exists
paymentSchema.statics.getInstance = async function () {
    let payment = await this.findOne();
    if (!payment) {
        payment = await this.create({
            crypto: { address: '', coinType: '', qrUrl: '' }
        });
    }
    return payment;
};

module.exports = mongoose.model('Payment', paymentSchema);
