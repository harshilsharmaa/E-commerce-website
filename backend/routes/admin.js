const express = require('express');
const router = express.Router();

const {isAuthenticated, isAdmin} = require('../middleware/auth');


const {
    addCategory,
    addProduct,
    updateProduct,
} = require('../controllers/admin');

router.route('/add/product').post(isAuthenticated, isAdmin, addProduct);
router.route('/update/product/:id').put(isAuthenticated, isAdmin, updateProduct);


router.route('/add/category').post(isAuthenticated, isAdmin, addCategory);

module.exports = router;