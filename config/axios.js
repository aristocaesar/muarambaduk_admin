const { default: axios } = require('axios');

class AxiosProvider {
  static async get(path) {
    return await axios
      .get(`${process.env.API_URL}${path}`)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async post(path, data) {
    return await axios
      .post(`${process.env.API_URL}${path}`, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response.data;
      });
  }

  static async put(path, data) {
    return await axios
      .put(`${process.env.API_URL}${path}`, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response.data;
      });
  }

  static async patch(path, data) {
    return await axios
      .patch(`${process.env.API_URL}${path}`, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response.data;
      });
  }

  static async delete(path) {
    return await axios
      .delete(`${process.env.API_URL}${path}`)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response.data;
      });
  }
}

module.exports = AxiosProvider;
