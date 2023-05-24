const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth')
const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware.isGuest, AuthController.login)
router.post('/authenticate', authMiddleware.isGuest, AuthController.authenticate)
router.post('/logout', authMiddleware.isAuthenticated, AuthController.signOut)

module.exports = router