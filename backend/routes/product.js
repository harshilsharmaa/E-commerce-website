const express = require('express');
const router = express.Router();

const {isAuthenticated, isAdmin} = require('../middleware/auth');

const {
getProducts,
getProductById,
getProductsBySlug,
getProductsByCategory,
searchProduct,
addOrRemoveProductToWhishlist,
buyProduct,
rateAndRevivew
} = require('../controllers/product');

router.route('/all').get(getProducts);

router.route('/:id/:slug').get(getProductById);

router.route('/:slug').get(getProductsBySlug);

router.route('/category/:category').get(getProductsByCategory);

router.route('/search/:name').get(searchProduct);

router.route('/towhishlist/:id').put(isAuthenticated, addOrRemoveProductToWhishlist);

router.route('/rate/:id').post(isAuthenticated, rateAndRevivew);

router.route('/buy/:id').post(isAuthenticated, buyProduct);



module.exports = router;