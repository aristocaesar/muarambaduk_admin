const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/administartor');
const authMiddleware = require('../middlewares/auth');

router.get(
  '/',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  AdminController.admin
);

router.get(
  '/add',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  AdminController.addView
);
router.post(
  '/add',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  AdminController.store
);

router.get(
  '/edit/:id',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  AdminController.editView
);
router.post(
  '/edit/:id',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  AdminController.update
);

router.post(
  '/delete/:id',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  AdminController.deleteAdmin
);

module.exports = router;
