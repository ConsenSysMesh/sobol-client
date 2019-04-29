const axios = require('axios');

class Request {
  /**
   * Extends the `axios` ajax library for use in the client
   * @param {string} endpoint (required)
   * @param {object} headers
   * @param {string} token
   * @returns {object} this
   */
  configure(params) {
    this._endpoint = params.endpoint || this._endpoint || '';
    this._headers = params.headers || this._headers || {};
    this._key = params.key || this._key || null;

    if (params.errorHandler) this._setErrorHandler(params.errorHandler);
    this._setAuthHeader();

    return this;
  }

  /**
   * Destroys the request instance
   * @returns {object} this
   */
  destroy() {
    if (this._headers.Authorization) delete this._headers.Authorization;
    return this;
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

  /**
   * PRIVATE METHODS
   * ======================================================
   */

  /**
   * Handles all request errors
   * @param {object} error
   * @returns {object} error
   */
  _handleError(error) {
    return Promise.reject(error);
  }

  /**
   * Sets the authentication header
   * @param {string} token
   * @returns {void}
   */
  _setAuthHeader() {
    this._headers = {
      ...this._headers,
      Authorization: (this._key ? `Bearer ${this._key}` : 'None'),
    };
  }

  /**
   * Sets the error handler
   * @param {funciton} handler
   * @returns {void}
   */
  _setErrorHandler(handler) {
    if (handler) this._handleError = handler;
  }
}

module.exports = Request;
