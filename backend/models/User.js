const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        select: false,
    },
    address: {
        type: String,
        default: '',
    },
    phone: {
        type: Number,
        default: 0,
    },
    isAdmin:{
        type: Boolean,
        default: false,
        select: false,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    myCart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    myOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
    myWishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    myReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],


    resetPasswordToken: String,
    resetPasswordExpire: Date,

})


userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8);
        next();
    }
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAuthToken = function (){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User =  mongoose.model('User', userSchema);
module.exports = User;