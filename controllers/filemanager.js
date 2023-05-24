const uploads = require('./uploads');

// filemanager page
const filemanager = async (request, response, next) => {
  let files;
  const keyword = request.query.search;
  if (keyword == undefined) {
    files = await uploads.get();
  } else {
    files = await uploads.search(keyword);
  }
  response.render('../views/pages/filemanager/filemanager', {
    title: 'Filemanager',
    name: 'filemanager',
    keyword,
    files,
  });
};

const upload = async (request, response, next) => {
  try {
    console.log(request.files);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  filemanager,
  upload,
};
