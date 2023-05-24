const express = require('express');
const router = express.Router();
const FilemanagerController = require('../controllers/filemanager');
const authMiddleware = require('../middlewares/auth');

router.get(
  '/',
  authMiddleware.isAuthenticated,
  FilemanagerController.filemanager
);

router.post(
  '/upload',
  authMiddleware.isAuthenticated,
  FilemanagerController.upload
);

module.exports = router;
