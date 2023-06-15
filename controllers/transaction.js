const { request } = require('express');
const AxiosProvider = require('../config/axios');
const Currency = require('../utils/currency');

const TransactionModel = (transaction) => {
  return {
    id: transaction.id,
    order_id: transaction.order_id,
    user: transaction.user,
    transaction_id: transaction.transaction_id,
    camping: transaction.camping,
    type: transaction.type,
    date: transaction.date,
    date_types: transaction.date_types,
    sub_total: Currency.IDR(transaction.gross_amount - 5000),
    gross_amount: Currency.IDR(transaction.gross_amount),
    status: transaction.status,
    va_numbers: transaction.va_numbers,
    packages:
      transaction.packages != undefined
        ? transaction.packages.map((pkg) => {
            return {
              id: pkg.id,
              title: pkg.title,
              price: Currency.IDR(pkg.price),
              gross_amount: Currency.IDR(pkg.price * pkg.quantity),
              quantity: pkg.quantity,
            };
          })
        : [],
    tickets:
      transaction.tickets != undefined
        ? transaction.tickets.map((ticket) => {
            return {
              id: ticket.id,
              title: ticket.title,
              category: ticket.category,
              price: Currency.IDR(ticket.price),
              name: ticket.name,
              identity: ticket.identity,
            };
          })
        : [],
    barcode: transaction.barcode,
    expired_at: transaction.expired_at,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
  };
};

// Function allow only number
function toNumber(value) {
  return parseInt(value.replace(/\D/g, ''));
}

// view transaction
const transaction = async (request, response, next) => {
  const search = request.query.search == undefined ? '' : request.query.search;

  let _transaction = await AxiosProvider.get(`payments`).then((transaction) =>
    transaction.data.map((trx) => TransactionModel(trx))
  );

  response.render('../views/pages/transaction/index', {
    title: 'Transaksi',
    name: 'Daftar Transaksi',
    keyword: search != undefined ? search : '',
    transactions: _transaction,
    notification: request.flash('notification'),
  });
};

// view check transaction
const viewCheckTransactionOne = async (request, response, next) => {
  const search = request.query.search;

  const _transaction =
    search == '' || search == undefined
      ? []
      : await AxiosProvider.get(`payments/${search}`)
          .then((transaction) =>
            transaction.data.length == 0
              ? 'Transaksi tersebut tidak tersedia'
              : TransactionModel(transaction.data)
          )
          .catch(() => 'Transaksi tersebut tidak tersedia');

  response.render('../views/pages/transaction/check', {
    title: 'Cek Transaksi',
    name: 'Cek Transaksi',
    keyword: search == undefined ? '' : search,
    transaction: _transaction,
    notification: request.flash('notification'),
  });
};

// view create transaction
const viewCreateTransactionOne = async (request, response, next) => {
  const search =
    request.query.search == undefined || request.query.search == ''
      ? []
      : await AxiosProvider.get(`users/${request.query.search}`).then(
          (users) => users.data
        );

  response.render('../views/pages/transaction/create', {
    title: 'Buat Transaksi',
    name: 'Buat Transaksi',
    keyword: search.length == 0 ? '' : request.query.search,
    users: search,
    notification: request.flash('notification'),
  });
};

// store product
const store = async (request, response, next) => {
  const { title, slug, description, image, price, compensation } = request.body;
  const price_product = toNumber(price);
  const price_compensation_product = toNumber(compensation);

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.post(`products`, {
    title,
    slug,
    description,
    image,
    price: price_product,
    compensation: price_compensation_product,
  })
    .then((product) => {
      notif.type = 'success';
      notif.message = `Berhasil menambahkan produk ${product.data.title}`;
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect('/products/add');
};

const detail = async (request, response, next) => {
  const { id } = request.params;

  const _transaction = await AxiosProvider.get(`payments/${id}`).then(
    (transaction) => TransactionModel(transaction.data)
  );

  if (_transaction.length == 0) {
    response.redirect('/transaction');
  } else {
    response.render('../views/pages/transaction/detail', {
      title: 'Detail Transaksi',
      name: 'Detail Transaksi',
      transaction: _transaction,
      notification: request.flash('notification'),
    });
  }
};

const update = async (request, response, next) => {
  const { id } = request.params;

  const { title, slug, description, image, price, compensation } = request.body;
  const price_product = toNumber(price);
  const price_compensation_product = toNumber(compensation);

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.put(`products/${id}`, {
    title,
    slug,
    description,
    image,
    price: price_product,
    compensation: price_compensation_product,
  })
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil memperbarui produk';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/products/edit/${id}`);
};

const deleteProduct = async (request, response, next) => {
  const { id } = request.params;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.delete(`products/${id}`)
    .then((success) => {
      notif.type = 'success';
      notif.message = 'Berhasil menghapus produk';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/products`);
};

module.exports = {
  transaction,
  viewCheckTransactionOne,
  viewCreateTransactionOne,
  store,
  detail,
  update,
  deleteProduct,
};
