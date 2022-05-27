const express = require('express');
const router = express.Router();

const {isAuthenticated, isAdmin} = require('../middleware/auth');

const {
    addToCart, 
    emptyCart,
    removeOneFromCart,
} = require('../controllers/cart');


router.route('/add/:id').post(isAuthenticated, addToCart);

router.route('/remove/:id').post(isAuthenticated, removeOneFromCart);

router.route('/empty').post(isAuthenticated, emptyCart);



module.exports = router;