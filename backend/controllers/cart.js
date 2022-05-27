const User = require("../models/User");

exports.addToCart = async (req, res) => {
    try {
        req.user.myCart.push(req.params.id);

        await req.user.save();

        res.status(200).json({
            message: "Product added to cart successfully",
            success: true
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

exports.removeOneFromCart = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }

        req.user.myCart.pull(req.params.id);

        await req.user.save();

        res.status(200).json({
            message: "Product removed from cart successfully",
            success: true
        })

    }
    catch(error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

exports.emptyCart = async(req, res) => {
    try {
        req.user.myCart = [];
        await req.user.save();

        res.status(200).json({
            message: "Cart emptied successfully",
            success: true
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}