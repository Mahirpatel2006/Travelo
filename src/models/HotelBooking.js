const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    hotelName: {
        type: String,
        required: true,
    },
    hname: {
        type: String,
        required: true,
    },
    hpnumber: {
        type: String,
        required: true,
    },
    hadate: {
        type: Date,
        required: true,
    },
    hlday: {
        type: Date,
        required: true,
    },
    hconemail: {
        type: String,
        required: true,
    },
    hconnumber: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed',
        index: true,
    },
}, { timestamps: true });

const hotel_booking = mongoose.model('Hotel_booking', hotelSchema);
module.exports = hotel_booking;