const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// GET all shipments
router.get('/', async (req, res) => {
    try {
        const shipments = await Shipment.find().sort({ createdAt: -1 });
        res.json(shipments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one shipment
router.get('/:trackingId', async (req, res) => {
    try {
        const trackingId = req.params.trackingId.trim().toLowerCase();

        // Use a regex for case-insensitive search
        const shipment = await Shipment.findOne({ trackingId: new RegExp(`^${trackingId}$`, 'i') });

        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

        res.json(shipment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST create shipment
router.post('/', async (req, res) => {
    try {
        const shipment = new Shipment({
            trackingId: req.body.trackingId,

            history: [{
                date: new Date(),
                location: req.body.shipmentDetails.origin,
                status: req.body.shipmentDetails.status,
                notes: req.body.shipmentDetails.historyNotes || 'Shipment sent out!'
            }],

            shipper: req.body.shipper,
            receiver: req.body.receiver,

            shipmentDetails: {
                ...req.body.shipmentDetails,
                paymentMode: "Crypto & Wire Transfer"
            },

            invoice: {
                number: req.body.invoice?.number || '',
                date: req.body.invoice?.date || '',
                image: req.body.invoice?.image || '',
                description: req.body.invoice?.description || '',
                quantity: req.body.invoice?.quantity || 1,
                total: req.body.invoice?.total || ''
            }
        });

        const newShipment = await shipment.save();
        res.status(201).json(newShipment);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// PATCH update shipment
router.patch('/:trackingId', async (req, res) => {
    try {
        const shipment = await Shipment.findOne({
            trackingId: req.params.trackingId
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        const oldStatus = shipment.shipmentDetails.status;
        const oldDestination = shipment.shipmentDetails.destination;

        const newStatus = req.body.shipmentDetails?.status;
        const newDestination = req.body.shipmentDetails?.destination;

        // Update fields
        Object.assign(shipment.shipper, req.body.shipper || {});
        Object.assign(shipment.receiver, req.body.receiver || {});
        Object.assign(shipment.shipmentDetails, req.body.shipmentDetails || {});
        Object.assign(shipment.invoice, req.body.invoice || {});

        const statusChanged =
            newStatus && newStatus !== oldStatus;

        const destinationChanged =
            newDestination && newDestination !== oldDestination;

        if (statusChanged || destinationChanged) {
            let note = req.body.history.notes;
            console.log(req.body)

            if (!note) {
                if (statusChanged && destinationChanged) {
                    note = `Status changed to "${newStatus}" and destination updated`;
                } else if (statusChanged) {
                    note = `Status changed to "${newStatus}"`;
                } else {
                    note = `Destination updated to ${newDestination}`;
                }
            }

            shipment.history.unshift({
                date: new Date(),
                location: newDestination || oldDestination,
                status: newStatus || oldStatus,
                notes: note
            });
        }

        await shipment.save();
        res.json(shipment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// DELETE shipment
router.delete('/:trackingId', async (req, res) => {
    try {
        const shipment = await Shipment.findOneAndDelete({ trackingId: req.params.trackingId });
        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
        res.json({ message: 'Shipment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;