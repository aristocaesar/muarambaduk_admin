const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware.isAuthenticated, (request, response, next) => {
  response.render('../views/pages/about/index', {
    title: 'Tentang',
    name: 'Tentang',
  });
});

module.exports = router;
