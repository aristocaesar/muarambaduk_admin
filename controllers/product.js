const AxiosProvider = require('../config/axios');
const Currency = require('../utils/currency');

const ProductModel = (product) => {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    image: product.image,
    price: Currency.IDR(product.price),
    compensation: Currency.IDR(product.compensation),
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
};

// Function allow only number
function toNumber(value) {
  return parseInt(value.replace(/\D/g, ''));
}

// view products
const products = async (request, response, next) => {
  const search = request.query.search == undefined ? '' : request.query.search;
  const limit = request.query.limit == undefined ? 20 : request.query.limit;
  const current =
    request.query.current == undefined ? 1 : request.query.current;

  let _products = await AxiosProvider.get(
    `products?search=${search}&limit=${limit}&current=${current}`
  ).then((products) => products.data.map((product) => ProductModel(product)));

  response.render('../views/pages/product/product', {
    title: 'Produk',
    name: 'Daftar Produk',
    keyword: search != undefined ? search : '',
    products: _products,
    notification: request.flash('notification'),
  });
};

// view add product
const addView = (request, response, next) => {
  response.render('../views/pages/product/add', {
    title: 'Tambah Produk',
    name: 'Tambah Produk',
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

const editView = async (request, response, next) => {
  const { id } = request.params;

  const _product = await AxiosProvider.get(`products/${id}`).then(
    (product) => product.data
  );

  if (_product.length == 0) {
    response.redirect('/products');
  } else {
    response.render('../views/pages/product/edit', {
      title: 'Edit Produk',
      name: 'Edit Produk',
      product: ProductModel(_product),
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
  products,
  addView,
  store,
  editView,
  update,
  deleteProduct,
};
