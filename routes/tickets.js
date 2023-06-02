const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/tickets');
const authMiddleware = require('../middlewares/auth');

router.get(
  '/',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  AdminController.tickets
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

module.exports = router;
