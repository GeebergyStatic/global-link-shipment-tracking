const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    address: { type: String, required: true },
    coinType: { type: String, required: true },
    qrUrl: { type: String, required: true }
});

const paymentSchema = new mongoose.Schema({
    crypto: { type: cryptoSchema, required: true }
}, { timestamps: true });

// Singleton pattern
paymentSchema.statics.getInstance = async function () {
    let payment = await this.findOne();
    if (!payment) {
        payment = await this.create({
            crypto: { address: 'TEMP', coinType: 'TEMP', qrUrl: 'TEMP' }
        });
    }
    return payment;
};

module.exports = mongoose.model('Payment', paymentSchema);
