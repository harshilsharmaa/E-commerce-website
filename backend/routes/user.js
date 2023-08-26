const express = require('express');
const router = express.Router();

const {isAuthenticated} = require('../middleware/auth');

const {

register,
login,
logout,
updatePassword,
forgotPassword,
resetPassword,
requestOTPForPhone,
verifyOTP,
myProfile,
updateAddress,
deleteProfile

} = require('../controllers/user');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(isAuthenticated,logout);
router.route('/update/password').put(isAuthenticated,updatePassword);
router.route('/update/address').put(isAuthenticated,updateAddress);

router.route('/profile').get(isAuthenticated,myProfile);

// Phone number verification routes
router.route('/request/otp').post(isAuthenticated,requestOTPForPhone);
router.route('/verify/otp').post(isAuthenticated,verifyOTP);


// Forgot password routes
router.route('/forgot/password').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);


router.route('/delete/profile').put(deleteProfile);

module.exports = router;