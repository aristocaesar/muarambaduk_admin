const express = require('express');
const router = express.Router();
const FaqController = require('../controllers/faq');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware.isAuthenticated, FaqController.faq);

router.get('/add', authMiddleware.isAuthenticated, FaqController.addView);
router.post('/add', authMiddleware.isAuthenticated, FaqController.store);

router.get('/edit/:id', authMiddleware.isAuthenticated, FaqController.editView);
router.post('/edit/:id', authMiddleware.isAuthenticated, FaqController.update);

router.post(
  '/delete/:id',
  authMiddleware.isAuthenticated,
  FaqController.deleteFaq
);

module.exports = router;
