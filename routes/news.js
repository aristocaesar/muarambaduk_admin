const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/news');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware.isAuthenticated, NewsController.news);
router.get('/add', authMiddleware.isAuthenticated, NewsController.addView);

router.post('/add', authMiddleware.isAuthenticated, NewsController.store);

router.get(
  '/edit/:id',
  authMiddleware.isAuthenticated,
  NewsController.editView
);
router.post('/edit/:id', authMiddleware.isAuthenticated, NewsController.update);

router.post(
  '/delete/:id',
  authMiddleware.isAuthenticated,
  NewsController.deleteNews
);

module.exports = router;
