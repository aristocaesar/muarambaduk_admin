const AxiosProvider = require('../config/axios');

const FaqModel = (faq) => {
  return {
    id: faq.id,
    title: faq.title,
    description: faq.description,
    created_at: faq.created_at,
    updated_at: faq.updated_at,
  };
};

// view faq
const faq = async (request, response, next) => {
  let faqs = await AxiosProvider.get(`faq`).then((faq_data) =>
    faq_data.data.map((fq) => FaqModel(fq))
  );

  response.render('../views/pages/faq/faq', {
    title: 'Faq',
    name: 'Daftar Faq',
    faqs: faqs,
    notification: request.flash('notification'),
  });
};

// view add faq
const addView = (request, response, next) => {
  response.render('../views/pages/faq/add', {
    title: 'Tambah Faq',
    name: 'Tambah Faq',
    notification: request.flash('notification'),
  });
};

// store faq
const store = async (request, response, next) => {
  const { title, description } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.post(`faq`, {
    title,
    description,
  })
    .then((news) => {
      notif.type = 'success';
      notif.message = `Berhasil menambahkan faq dengan judul ${news.data.title}`;
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect('/faq/add');
};

const editView = async (request, response, next) => {
  const { id } = request.params;

  const _faq = await AxiosProvider.get(`faq/${id}`).then((fq) => fq.data);

  if (_faq.length == 0) {
    response.redirect('/faq');
  } else {
    response.render('../views/pages/faq/edit', {
      title: 'Edit Faq',
      name: 'Edit Faq',
      faq: FaqModel(_faq),
      notification: request.flash('notification'),
    });
  }
};

const update = async (request, response, next) => {
  const { id } = request.params;

  const { title, description } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.put(`faq/${id}`, {
    title,
    description,
  })
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil memperbarui faq';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/faq/edit/${id}`);
};

const deleteFaq = async (request, response, next) => {
  const { id } = request.params;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.delete(`faq/${id}`)
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil menghapus faq';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/faq`);
};

module.exports = {
  faq,
  addView,
  store,
  editView,
  update,
  deleteFaq,
};
