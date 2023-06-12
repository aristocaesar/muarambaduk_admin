const AxiosProvider = require('../config/axios');
const Currency = require('../utils/currency');
const { ucwords } = require('../utils/strings');

const PackagesModel = (pkg) => {
  return {
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    category: ucwords(pkg.category),
    description: pkg.description,
    price: Currency.IDR(pkg.price),
    image: pkg.image,
    products: pkg.products,
    created_at: pkg.created_at,
    updated_at: pkg.updated_at,
  };
};

const ReviewModel = (review) => {
  return {
    id: review.id,
    package: review.package,
    package_name: review.package_name,
    payment: review.payment,
    fullname: review.fullname,
    images: review.images,
    star: review.star,
    description: review.description,
    created_at: review.created_at,
    updated_at: review.updated_at,
  };
};

// Function allow only number
function toNumber(value) {
  return parseInt(value.replace(/\D/g, ''));
}

// view products
const packages = async (request, response, next) => {
  const search = request.query.search == undefined ? '' : request.query.search;
  const limit = request.query.limit == undefined ? 20 : request.query.limit;
  const current =
    request.query.current == undefined ? 1 : request.query.current;

  let _packages = await AxiosProvider.get(
    `packages?search=${search}&limit=${limit}&current=${current}`
  ).then((packages) => packages.data.map((pkg) => PackagesModel(pkg)));

  response.render('../views/pages/packages/index', {
    title: 'Paket',
    name: 'Daftar Paket',
    keyword: search != undefined ? search : '',
    packages: _packages,
    notification: request.flash('notification'),
  });
};

const productsNotAvaible = async (request, response, next) => {
  const _products = await AxiosProvider.get(
    `packages/product-not-avaible/${request.params.id}`
  ).then((products) => products.data);
  response.json(_products);
};

// view add packages
const addView = (request, response, next) => {
  response.render('../views/pages/packages/add', {
    title: 'Tambah Paket',
    name: 'Tambah Paket',
    notification: request.flash('notification'),
  });
};

// store package
const store = async (request, response, next) => {
  const { title, slug, description, category, image, price } = request.body;
  let id = 0;
  const price_package = toNumber(price);

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.post(`packages`, {
    title,
    slug,
    description,
    category,
    image,
    price: price_package,
  })
    .then((packages) => {
      notif.type = 'success';
      notif.message = `Berhasil menambahkan ${packages.data.title} kedalam paket`;
      id = packages.data.id;
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });

  if (notif.type != 'danger') {
    response.redirect(`/packages/edit/${id}`);
  } else {
    response.redirect(`/packages/add`);
  }
};

const storeProduct = async (request, response, next) => {
  const { id } = request.params;
  const { title, quantity } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.post(`packages/${id}/store-product`, {
    title,
    quantity,
  })
    .then((product) => {
      notif.type = 'success';
      notif.message = `Berhasil menambahkan ${product.data.product} kedalam item paket`;
      product.data;
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });

  response.redirect(`/packages/edit/${id}`);
};

const editView = async (request, response, next) => {
  const { id } = request.params;

  const _packages = await AxiosProvider.get(`packages/${id}`).then(
    (pkg) => pkg.data
  );

  if (_packages.length == 0) {
    response.redirect('/packages');
  } else {
    response.render('../views/pages/packages/edit', {
      title: 'Edit Paket',
      name: 'Edit Paket',
      packages: PackagesModel(_packages),
      notification: request.flash('notification'),
    });
  }
};

const updateProduct = async (request, response, next) => {
  const { id_package, id_product } = request.params;
  const { title, quantity } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.put(
    `packages/${id_package}/update-product/${id_product}`,
    {
      quantity,
    }
  )
    .then((product) => {
      notif.type = 'success';
      notif.message = `Berhasil memperbarui item ${title}`;
      product.data;
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });

  response.redirect(`/packages/edit/${id_package}`);
};

const update = async (request, response, next) => {
  const { id } = request.params;

  const { title, slug, description, category, image, price } = request.body;
  const price_package = toNumber(price);

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.put(`packages/${id}`, {
    title,
    slug,
    description,
    category,
    image,
    price: price_package,
  })
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil memperbarui paket';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/packages/edit/${id}`);
};

const deleteProduct = async (request, response, next) => {
  const { id_package, id_product } = request.params;
  const { title } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.delete(
    `packages/${id_package}/delete-product/${id_product}`
  )
    .then((product) => {
      notif.type = 'success';
      notif.message = `Berhasil menghapus item ${title}`;
      product.data;
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });

  response.redirect(`/packages/edit/${id_package}`);
};

const deletePackage = async (request, response, next) => {
  const { id } = request.params;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.delete(`packages/${id}`)
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil menghapus paket';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/packages`);
};

const showReview = async (request, response, next) => {
  const search = request.query.search == undefined ? '' : request.query.search;

  let _reviews = await AxiosProvider.get(`reviews`).then((reviews) =>
    reviews.data.map((review) => ReviewModel(review))
  );

  response.render('../views/pages/packages/reviews/index', {
    title: 'Review Paket',
    name: 'Review Paket',
    keyword: search != undefined ? search : '',
    reviews: _reviews,
    notification: request.flash('notification'),
  });
};

const editViewReview = async (request, response, next) => {
  const { id } = request.params;

  const _review = await AxiosProvider.get(`reviews/${id}`).then((review) =>
    ReviewModel(review.data)
  );

  if (_review.length == 0) {
    response.redirect('/review');
  } else {
    response.render('../views/pages/packages/reviews/edit', {
      title: 'Edit Review Paket',
      name: 'Edit Review Paket',
      review: _review,
      notification: request.flash('notification'),
    });
  }
};

const deleteReview = async (request, response, next) => {
  const { id } = request.params;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.delete(`reviews/${id}`)
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil menghapus review';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/packages/review`);
};

module.exports = {
  packages,
  addView,
  productsNotAvaible,
  store,
  storeProduct,
  editView,
  updateProduct,
  update,
  deleteProduct,
  deletePackage,
  showReview,
  editViewReview,
  deleteReview,
};
