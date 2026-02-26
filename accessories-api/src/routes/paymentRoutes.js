const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/initiate', paymentController.initiatePayment);
router.post('/verify', paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);
router.post('/refund/:id', paymentController.refundOrder);

module.exports = router;
