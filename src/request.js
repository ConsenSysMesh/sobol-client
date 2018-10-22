const axios = require('axios');

class Request {
  /**
   * Extends the `axios` ajax library for use in the client
   * @param {string} endpoint (required)
   * @param {object} headers
   * @param {string} token
   * @returns {object} this
   */
  constructor(endpoint, headers = {}, token) {
    if (!endpoint) throw new Error('Request requires an `endpoint`.');
    this._endpoint = endpoint;
    this._headers = headers;

    if (token) {
      this.setToken(token);
    }

    return this;
  }

  /**
   * Throws all request errors
   * @param {object} error
   * @returns {void}
   */
  _handleError(error) {
    throw error;
  }

  /**
   * Sets the authentication header
   * @param {string} token
   * @returns {void}
   */
  setToken(token) {
    const Authorization = (token ? `Bearer ${token}` : 'None');
    this._token = token;
    this._headers = {
      ...this._headers,
      Authorization,
    };
  }

  /**
   * Makes a GET request
   * @param {string} path
   * @returns {promise} response
   */
  get(path) {
    return axios.get(`${this._endpoint}${path}`, {
      headers: this._headers,
    }).catch(this._handleError);
  }

  /**
   * Makes a POST request
   * @param {string} path
   * @param {object} data
   * @returns {promise} response
   */
  post(path, data) {
    return axios.post(`${this._endpoint}${path}`, data || {}, {
      headers: this._headers,
    }).catch(this._handleError);
  }

  /**
   * Makes a PUT request
   * @param {string} path
   * @param {object} data
   * @returns {promise} response
   */
  put(path, data) {
    return axios.put(`${this._endpoint}${path}`, data || {}, {
      headers: this._headers,
    }).catch(this._handleError);
  }

  /**
   * Makes a DELETE request
   * @param {string} path
   * @returns {promise} response
   */
  delete(path) {
    return axios.delete(`${this._endpoint}${path}`, {
      headers: this._headers,
    }).catch(this._handleError);
  }
}

module.exports = Request;
