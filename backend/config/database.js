const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect('mongodb://localhost:27017/my-shop')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
}

module.exports = connectDB;