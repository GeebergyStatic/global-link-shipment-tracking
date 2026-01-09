const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    location: String,
    status: String,
    notes: String
});

const shipperSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String
});

const receiverSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String
});

const shipmentDetailsSchema = new mongoose.Schema({
    image: String,
    origin: String,
    destination: String,
    carrier: String,
    carrierRef: String,
    packageType: String,
    totalFreight: String,
    weight: String,
    shipmentMode: String,
    paymentMode: { type: String, default: "Crypto & Wire Transfer" },
    expectedDelivery: String,
    departureDate: String,
    deliveryTime: String,
    status: String
});

const invoiceSchema = new mongoose.Schema({
    number: String,
    date: String,
    image: String,
    description: String,
    quantity: Number,
    total: String
});

const shipmentSchema = new mongoose.Schema({
    trackingId: { type: String, unique: true, required: true },
    history: [historySchema],
    shipper: shipperSchema,
    receiver: receiverSchema,
    shipmentDetails: shipmentDetailsSchema,
    invoice: invoiceSchema
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);