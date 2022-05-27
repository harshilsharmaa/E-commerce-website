const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({
                message: 'Please Login First',
                success: false
            })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if(!user){
            return res.status(401).json({
                message: 'Please Login First',
                success: false
            })
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: error.message,
            success: false
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('+isAdmin');
        if(user.isAdmin==true){
            next();
        }
        else{
            return res.status(401).json({
                message: 'You are not an admin',
                success: false
            })
        }
    }
    catch (error) {
        res.status(401).json({
            message: error.message,
            success: false
        })
    }
}