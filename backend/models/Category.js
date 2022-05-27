const mongoose = require('mongoose');

const catagorySchema = new mongoose.Schema({
    
    name: {
        type: String,
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    createdAt: {
        type: Date,
    }
})

const Category =  mongoose.model('Category', catagorySchema);
module.exports = Category;