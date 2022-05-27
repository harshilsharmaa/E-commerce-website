const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})