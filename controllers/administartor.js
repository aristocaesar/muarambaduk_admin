const AxiosProvider = require('../config/axios');

const AdminModel = (admin) => {
  return {
    id: admin.id,
    fullname: admin.fullname,
    email: admin.email,
    access: admin.access,
    created_at: admin.created_at,
    updated_at: admin.updated_at,
  };
};

// view admin
const admin = async (request, response, next) => {
  const search = undefined;
  let admins = await AxiosProvider.get(`admin`).then((admin_data) =>
    admin_data.data.map((adm) => AdminModel(adm))
  );

  response.render('../views/pages/admin/index', {
    title: 'Admin',
    name: 'Daftar Admin',
    admins: admins,
    keyword: search != undefined ? search : '',
    notification: request.flash('notification'),
  });
};

// view add admin
const addView = (request, response, next) => {
  response.render('../views/pages/admin/add', {
    title: 'Tambah Admin',
    name: 'Tambah Admin',
    notification: request.flash('notification'),
  });
};

// store admin
const store = async (request, response, next) => {
  const { fullname, email, password, password_confirm } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  if (password === password_confirm) {
    await AxiosProvider.post(`admin`, {
      fullname,
      email,
      password,
      access: 'active',
    })
      .then((admin) => {
        notif.type = 'success';
        notif.message = `Berhasil menambahkan ${admin.data.fullname} sebagai admin`;
      })
      .catch((error) => {
        notif.type = 'danger';
        notif.message = error.errors.message;
      });
  } else {
    notif.type = 'danger';
    notif.message = 'Password yang dimasukkan tidak sama';
  }

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect('/admin/add');
};

const editView = async (request, response, next) => {
  const { id } = request.params;

  const _admin = await AxiosProvider.get(`admin/${id}`).then(
    (admin) => admin.data
  );

  if (_admin.length == 0) {
    response.redirect('/admin');
  } else {
    response.render('../views/pages/admin/edit', {
      title: 'Edit Admin',
      name: 'Edit Admin',
      admin: AdminModel(_admin),
      notification: request.flash('notification'),
    });
  }
};

const update = async (request, response, next) => {
  const { id } = request.params;
  const { fullname, email, password, password_confirm, access } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  if (password != undefined && password != undefined) {
    if (password != password_confirm) {
      notif.type = 'danger';
      notif.message = 'Password yang dimasukkan tidak sama';
    }
  }

  if (notif.message == null) {
    await AxiosProvider.put(`admin/${id}`, {
      fullname,
      email,
      password,
      access: access != undefined ? 'active' : 'suspend',
    })
      .then(() => {
        notif.type = 'success';
        notif.message = 'Berhasil memperbarui admin';
      })
      .catch((error) => {
        notif.type = 'danger';
        notif.message = error.errors.message;
      });
  }

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });

  response.redirect(`/admin/edit/${id}`);
};

const deleteAdmin = async (request, response, next) => {
  const { id } = request.params;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.delete(`admin/${id}`)
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil menghapus admin';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/admin`);
};

module.exports = {
  admin,
  addView,
  store,
  editView,
  update,
  deleteAdmin,
};
