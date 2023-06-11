const express = require('express');
const router = express.Router();
const PackageController = require('../controllers/packages');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware.isAuthenticated, PackageController.packages);

router.get(
  '/product-not-avaible/:id',
  authMiddleware.isAuthenticated,
  PackageController.productsNotAvaible
);

router.get('/add', authMiddleware.isAuthenticated, PackageController.addView);

router.post('/add', authMiddleware.isAuthenticated, PackageController.store);

router.post(
  '/:id/store-product',
  authMiddleware.isAuthenticated,
  PackageController.storeProduct
);

router.get(
  '/edit/:id',
  authMiddleware.isAuthenticated,
  PackageController.editView
);
router.post(
  '/edit/:id',
  authMiddleware.isAuthenticated,
  PackageController.update
);

router.post(
  '/:id_package/delete-product/:id_product',
  authMiddleware.isAuthenticated,
  PackageController.deleteProduct
);

router.post(
  '/:id_package/update-product/:id_product',
  authMiddleware.isAuthenticated,
  PackageController.updateProduct
);

router.post(
  '/delete/:id',
  authMiddleware.isAuthenticated,
  PackageController.deletePackage
);

router.get(
  '/review',
  authMiddleware.isAuthenticated,
  PackageController.showReview
);

module.exports = router;
