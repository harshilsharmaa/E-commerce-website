const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    slug:{
        type: String,
    },
    price: {
        type: Number,
    },
    coverImage: {
        public_id: String,
        url: String,
    },
    images: [{
        public_id: String,
        url: String,
    }],
    description: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    colors:{
        type: Array,
    },
    inStock:{
        type: Boolean,
        default: true,
    },
    availableQuantity:{
        type: Number,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    averageRating:{
        type: Number,
        default: 0,
    },
    totalRating:{
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
})

productSchema.pre("save", async function(next){
    if(this.isModified("name")){
        console.log(this.name);
        this.slug = this.name.split(" ").join("-").toLowerCase();
        console.log(this.slug);
    }
    next();
})

const Product =  mongoose.model('Product', productSchema);
module.exports = Product;