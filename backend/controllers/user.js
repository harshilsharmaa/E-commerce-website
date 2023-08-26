const User = require('../models/User');
const Otp = require('../models/OTP');
const {sendEmail} = require("../middleware/sendEmail");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const otpGenrator = require('otp-generator');
const unirest = require("unirest");

exports.register = async(req, res) => {
    try {

        if(!req.body.name || !req.body.email || !req.body.password){
            return res.status(400).json({
                error: 'Please fill all the fields',
                success: false
            })
        }

        const userData = {
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        };

        const checkUserEmail = await User.findOne({email:req.body.email});

        if(checkUserEmail){
            return res.status(400).json({
                error: 'User with this email already exists',
                success: false
            })
        }

        const user = await User.create(userData);

        const token = user.generateAuthToken();

        res.cookie('token', token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7})
        .status(201).json({
            message: 'User created successfully',
            user: user,
            success: true
        })

        
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

exports.login = async(req, res) => {
    try {

        if(!req.body.email || !req.body.password){
            return res.status(400).json({
                message: 'Please fill all the fields',
                success: false
            })
        }

        const {email, password} = req.body;
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(400).json({
                error: 'User with this email does not exist',
                success: false
            })
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({
                error: 'Invalid password',
                success: false
            })
        }

        const token = user.generateAuthToken();

        res.cookie('token', token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7})
        .status(201).json({
            message: 'User loggedIn successfully',
            user: user,
            success: true
        })


    }
    catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
}

exports.logout = async(req, res) => {
    try {
        res.cookie('token', '', {maxAge: -1})
        .status(200).json({
            message: 'User loggedOut successfully',
            success: true
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
}

exports.requestOTPForPhone = async(req,res)=>{
    try {
        
        const number = req.body.phone;
        console.log(number);

        const user = await User.findOne({phone:number})

        if(user){
            return res.status(400).json({
                error: 'User with this phone number already exists',
                success: false
            })
        }

        const OTP = otpGenrator.generate(4, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

        console.log(OTP);

        const otp = await  Otp.create({ number: number, otp: OTP });


        var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

        req.query({
            "authorization": "fvzOqj9dK6EZ5tjopxW0orPyU1xPzO0L2OZBvfHXPERZY97p7S6KYVd3nzsj",
            "sender_id": "FSTSMS",
            "message": `OTP is ${OTP}`,
            "language": "english",
            "route": "p",
            "numbers": `${number}`,
        });
        
        req.headers({
            "cache-control": "no-cache"
        });

        req.end(function (res) {
            if (res.error) throw new Error(res.error);
        });
        res.status(200)
        // .send(response)
        .json({
            message: 'OTP sent successfully',
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
}

exports.verifyOTP = async(req, res) => {
    try {
        
        const otpHolder = await Otp.find({
            number: req.body.phone
        });

        if (otpHolder.length === 0){

            return res.status(400).json({
                error: "You are using expired otp!",
                success: false
            })
        }


        const rightOtpFind = otpHolder[otpHolder.length - 1];

        
        const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

        if (validUser) {

            console.log(req.user);
            
            req.user.phone = req.body.phone;
            await req.user.save();
    
            const OtpDelete = await Otp.deleteMany({
                number: rightOtpFind.number
            });
    
            return res.status(200).json({
                message: 'Phone number verified successfully',
                success: true
            })
        }
        else {
            return res.status(400).json({
                error: 'Invalid OTP',
                success: false
            })
        }

    } catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
}

exports.updatePassword = async(req, res) => {
    try {
        if(!req.body.oldPassword || !req.body.newPassword){
            return res.status(400).json({
                error: 'Please fill all the fields',
                success: false
            })
        }

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.comparePassword(req.body.oldPassword);

        if(!isMatch){
            return res.status(400).json({
                error: 'Invalid password',
                success: false
            })
        }

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({
            message: 'Password updated successfully',
            success: true
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
}

exports.updateAddress = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if(!req.body.address){
            return res.status(400).json({
                error: 'Please fill all the fields',
                success: false
            })
        }
        user.address = req.body.address;

        await user.save();

        res.status(200).json({
            message: 'Address updated successfully',
            success: true
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
}

exports.forgotPassword = async(req, res) => {
    try {
        if(!req.body.email){
            return res.status(400).json({
                error: 'Please fill all the fields',
                success: false
            })
        }

        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(400).json({
                error: 'User with this email does not exist',
                success: false
            })
        }

        const resetPasswordToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a click on given link: \n\n ${resetUrl}`;


        try {
            await sendEmail({
                email: user.email,
                subject: "Password reset token",
                message
            });

            res.status(200).json({
                message: `Email sent to ${user.email}`,
                success: true
            })
        }
        catch(error){

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            res.status(500).json({
                error: error.message,
                success: false
            })
        }
    }
    catch (error) {
        res.status(500).json({
            error: error.message,
        })    
    }
}

exports.resetPassword = async(req,res)=>{

    try {

        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()},
        })

        if(!user){
            return res.status(401).json({
                error: "Invalid or expired token",
                success: false
            })
        }

        if(req.body.password ===undefined){
            return res.status(400).json({
                error: "Password is required",
                success: false
            })
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            message: "Password successfully updated",
            success: true
        })
        
    } catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
        
}

exports.myProfile = async(req, res) => {
    try {

        const user = await User.findById(req.user._id).select('-password');

        res.status(200).json({
            message: 'User profile',
            user,
            success: true
        })

    }
    catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
}

exports.deleteProfile = async(req,res)=>{
    try {

        const email = req.body.email;
        const user = await User.deleteOne({email});
        console.log(user);

        res.status(200).json({
            message:"User Removed Successfully",
            success: true
        })
        
    } catch (error) {
        res.status(500).json({
            error: error.message,
            success: false
        })
    }
}
// -------------------------------------------------------------------------------------------------------------
