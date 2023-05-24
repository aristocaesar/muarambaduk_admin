const momenjs = require('moment');
const AxiosProvider = require('../config/axios');

const NewsModel = (news) => {
  return {
    id: news.id,
    title: news.title,
    slug: news.slug,
    body: news.body,
    thumbnail: news.thumbnail,
    author: news.author,
    created_at: momenjs(news.created_at).format('DD/MM/YYYY'),
    updated_at: news.updated_at,
  };
};

// view news
const news = async (request, response, next) => {
  const search = request.query.search == undefined ? '' : request.query.search;
  const limit = request.query.limit == undefined ? 20 : request.query.limit;
  const current =
    request.query.current == undefined ? 1 : request.query.current;

  let _news = await AxiosProvider.get(
    `news?search=${search}&limit=${limit}&current=${current}`
  ).then((news_data) => news_data.data.map((nws) => NewsModel(nws)));

  response.render('../views/pages/news/news', {
    title: 'Berita',
    name: 'Daftar Berita',
    keyword: search != undefined ? search : '',
    news: _news,
    notification: request.flash('notification'),
  });
};

// view add news
const addView = (request, response, next) => {
  response.render('../views/pages/news/add', {
    title: 'Buat Berita',
    name: 'Buat Berita',
    notification: request.flash('notification'),
  });
};

// store news
const store = async (request, response, next) => {
  const { title, slug, body, thumbnail, author } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.post(`news`, {
    title,
    slug,
    body,
    thumbnail,
    author,
  })
    .then((news) => {
      notif.type = 'success';
      notif.message = `Berhasil menambahkan berita dengan judul ${news.data.title}`;
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect('/news/add');
};

const editView = async (request, response, next) => {
  const { id } = request.params;

  const _news = await AxiosProvider.get(`news/${id}`).then((nws) => nws.data);

  if (_news.length == 0) {
    response.redirect('/news');
  } else {
    response.render('../views/pages/news/edit', {
      title: 'Edit Berita',
      name: 'Edit Berita',
      news: NewsModel(_news),
      notification: request.flash('notification'),
    });
  }
};

const update = async (request, response, next) => {
  const { id } = request.params;

  const { title, slug, body, thumbnail, author } = request.body;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.put(`news/${id}`, {
    title,
    slug,
    body,
    thumbnail,
    author,
  })
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil memperbarui berita';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/news/edit/${id}`);
};

const deleteNews = async (request, response, next) => {
  const { id } = request.params;

  let notif = {
    type: null,
    message: null,
  };

  await AxiosProvider.delete(`news/${id}`)
    .then(() => {
      notif.type = 'success';
      notif.message = 'Berhasil menghapus berita';
    })
    .catch((error) => {
      notif.type = 'danger';
      notif.message = error.errors.message;
    });

  request.flash('notification', {
    type: notif.type,
    message: notif.message,
  });
  response.redirect(`/news`);
};

module.exports = {
  news,
  addView,
  store,
  editView,
  update,
  deleteNews,
};
