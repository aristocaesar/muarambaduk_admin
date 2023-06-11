const AxiosProvider = require('../config/axios');

const UserModel = (user) => {
  return {
    id: user.id,
    fullname: user.fullname,
    email: user.email,
    access: user.access,
    image: user.images,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

// view user
const user = async (request, response, next) => {
  const search = undefined;
  let users = await AxiosProvider.get(`users`).then((users_data) =>
    users_data.data.map((usr) => UserModel(usr))
  );

  response.render('../views/pages/user/index', {
    title: 'Pengguna',
    name: 'Daftar Pengguna',
    users,
    keyword: search != undefined ? search : '',
    notification: request.flash('notification'),
  });
};

const editView = async (request, response, next) => {
  const { id } = request.params;

  const _users = await AxiosProvider.get(`users/${id}`).then(
    (user) => user.data
  );

  if (_users.length == 0) {
    response.redirect('/users');
  } else {
    response.render('../views/pages/user/edit', {
      title: 'Edit Pengguna',
      name: 'Edit Pengguna',
      user: UserModel(_users),
      notification: request.flash('notification'),
    });
  }
};

const update = async (request, response, next) => {
  const { id } = request.params;
  const { access } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  if (notif.message == null) {
    await AxiosProvider.put(`users/${id}/change-access`, {
      access: access != undefined ? 'active' : 'suspend',
    })
      .then(() => {
        notif.type = 'success';
        notif.message = 'Berhasil memperbarui pengguna';
      })
      .catch((error) => {
        console.log(error);
        notif.type = 'danger';
        notif.message = error.errors.message;
      });
  }

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });

  response.redirect(`/users/edit/${id}`);
};

module.exports = {
  user,
  editView,
  update,
};
