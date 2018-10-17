import axios from 'axios';

class Request {
  constructor(endpoint, headers={}, token) {
    if (!endpoint) throw new Error('Request requires an `endpoint`.');
    this._endpoint = endpoint
    this._headers = headers;

    if (token) {
      this.setToken(token);
    }
  }

  _handleError(error) {  
    throw error;
  }

  setToken(token) {
    this._token = token;
    this._headers = {
      Authorization: `Bearer ${token}`,
      ...this._headers,
    };
  }

  get(path) {
    return axios.get(`${this._endpoint}${path}`, {
      headers: this._headers,
    }).catch(this._handleError);
  }

  post(path, data) {
    return axios.post(`${this._endpoint}${path}`, data || {}, {
      headers: this._headers,
    }).catch(this._handleError);
  }

  put(path, data) {
    return axios.put(`${this._endpoint}${path}`, data || {}, {
      headers: this._headers,
    }).catch(this._handleError);
  }

  delete(path) {
    return axios.delete(`${this._endpoint}${path}`, {
      headers: this._headers,
    }).catch(this._handleError);
  }
}

export default Request;
