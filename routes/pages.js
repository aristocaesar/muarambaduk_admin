const express = require('express');
const router = express.Router();
const PagesController = require('../controllers/pages');
const authMiddleware = require('../middlewares/auth');

router.get(
  '/:slug',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  PagesController.show
);

router.post(
  '/:slug',
  [authMiddleware.isAuthenticated, authMiddleware.isAdmin],
  PagesController.update
);

module.exports = router;
