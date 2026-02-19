const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories, addReview } = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/:id/reviews', addReview);   // Public — any customer can review

module.exports = router;
