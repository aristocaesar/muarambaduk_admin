const express = require('express');
const router = express.Router();
const SettingController = require('../controllers/setting');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware.isAuthenticated, SettingController.setting);
router.post('/:id', authMiddleware.isAuthenticated, SettingController.update);

module.exports = router;
