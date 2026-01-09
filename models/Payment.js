const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    crypto: {
        address: { type: String, required: true },
        qrUrl: { type: String, required: true }
    }
}, { timestamps: true });

// Ensure only one document exists
paymentSchema.statics.getInstance = async function () {
    let payment = await this.findOne();
    if (!payment) {
        payment = await this.create({
            crypto: { address: '', qrUrl: '' }
        });
    }
    return payment;
};

module.exports = mongoose.model('Payment', paymentSchema);