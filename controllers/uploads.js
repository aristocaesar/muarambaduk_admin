const { default: axios } = require('axios');

const get = async () => {
  return await axios.get(`${process.env.API_URL}/uploads`).then((files) =>
    files.data.data.map((fl) => {
      return Object.assign(
        { download: `${process.env.API_URL}/uploads/${fl.filename}?download` },
        fl
      );
    })
  );
};

const search = async (keyword) => {
  return await axios
    .get(`${process.env.API_URL}/uploads?search=${keyword}`)
    .then((files) => files.data.data);
};

module.exports = { get, search };
