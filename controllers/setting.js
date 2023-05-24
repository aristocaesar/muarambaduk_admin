const AxiosProvider = require('../config/axios');

// view setting
const setting = async (request, response, next) => {
  response.render('../views/pages/admin/setting', {
    title: 'Pengaturan',
    name: 'Pengaturan',
    notification: request.flash('notification'),
  });
};

const update = async (request, response, next) => {
  const { id } = request.params;

  if (id == '' || id == undefined) response.redirect(`/setting`);

  const body = request.body;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.put(`admin/${id}`, body)
    .then(() => {
      if (body.fullname != undefined || body.email != undefined) {
        let userInfo = {
          id: request.session.user.id,
          name:
            body.fullname == undefined
              ? request.session.user.name
              : body.fullname,
          email:
            body.email == undefined ? request.session.user.email : body.email,
          role: request.session.user.role,
        };

        request.session.user = userInfo;
        request.session.save();
      }

      notif.type = 'success';
      notif.message = 'Berhasil memperbarui profil';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/setting`);
};

module.exports = {
  setting,
  update,
};
