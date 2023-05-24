const express = require('express');
const router = express.Router();
const PackageController = require('../controllers/packages');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware.isAuthenticated, PackageController.packages);
router.get('/add', authMiddleware.isAuthenticated, PackageController.addView);

router.post('/add', authMiddleware.isAuthenticated, PackageController.store);

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
  '/delete/:id',
  authMiddleware.isAuthenticated,
  PackageController.deleteProduct
);

module.exports = router;
