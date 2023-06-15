const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction');
const authMiddleware = require('../middlewares/auth');

router.get(
  '/',
  authMiddleware.isAuthenticated,
  TransactionController.transaction
);

router.get(
  '/detail/:id',
  authMiddleware.isAuthenticated,
  TransactionController.detail
);

router.get('/create', authMiddleware.isAuthenticated, (req, res, next) =>
  res.redirect('/transaction/create/1')
);

router.get(
  '/create/1',
  authMiddleware.isAuthenticated,
  TransactionController.viewCreateTransactionOne
);

// CHECK
router.get(
  '/check',
  authMiddleware.isAuthenticated,
  TransactionController.viewCheckTransactionOne
);

// router.post(
//   '/add',
//   authMiddleware.isAuthenticated,
//   TransactionController.store
// );

// router.post(
//   '/edit/:id',
//   authMiddleware.isAuthenticated,
//   TransactionController.update
// );

// router.post(
//   '/delete/:id',
//   authMiddleware.isAuthenticated,
//   TransactionController.deleteProduct
// );

module.exports = router;
