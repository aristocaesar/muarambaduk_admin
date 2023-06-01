const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');

router.get(
  '/',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  UserController.user
);

router.get(
  '/edit/:id',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  UserController.editView
);
router.post(
  '/edit/:id',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  UserController.update
);

module.exports = router;
