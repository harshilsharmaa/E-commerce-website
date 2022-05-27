const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    
    review: {
        type: String,
    },
    stars: {
        type: Number,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

const Review =  mongoose.model('Review', reviewSchema);
module.exports = Review;