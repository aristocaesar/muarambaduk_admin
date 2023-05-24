const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware.isAuthenticated, ProductController.products);
router.get('/add', authMiddleware.isAuthenticated, ProductController.addView);

router.post('/add', authMiddleware.isAuthenticated, ProductController.store);

router.get(
  '/edit/:id',
  authMiddleware.isAuthenticated,
  ProductController.editView
);
router.post(
  '/edit/:id',
  authMiddleware.isAuthenticated,
  ProductController.update
);

router.post(
  '/delete/:id',
  authMiddleware.isAuthenticated,
  ProductController.deleteProduct
);

module.exports = router;
