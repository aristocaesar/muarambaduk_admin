const AxiosProvider = require('../config/axios');

// show page
const show = async (request, response, next) => {
  const { slug } = request.params;

  const _page = await AxiosProvider.get(`pages/${slug}`).then(
    (page) => page.data
  );
  if (_page.length == 0) response.redirect('/dashbard');

  response.render('../views/pages/pages_app/edit', {
    title: _page.pages,
    name: _page.pages,
    pages: _page,
    notification: request.flash('notification'),
  });
};

// update page
const update = async (request, response, next) => {
  const { slug } = request.params;
  const { body } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.put(`pages/${slug}`, {
    body,
  })
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil memperbarui halaman';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/pages/${slug}`);
};

module.exports = {
  show,
  update,
};
