const mongoose = require('mongoose');

// mongodb://localhost:27017/my-shop
// const connectDB =  async() => {
//     mongoose.connect("mongodb+srv://harshil:harshil@cluster0.5cpg1.mongodb.net/?retryWrites=true&w=majority")
//     .then(() => {
//         console.log('MongoDB Connected...');
//     })
//     .catch(err => console.log(err));
// }
const connectDB =  async() => {

    try {
        await mongoose.connect("mongodb+srv://harshil:harshil@cluster0.5cpg1.mongodb.net/?retryWrites=true&w=majority")
        console.log('MongoDB Connected...');
        return;
        
    } catch (error) {
        throw(error);
    }

}

module.exports = connectDB;