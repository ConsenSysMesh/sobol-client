import axios from 'axios';

class Request {
  constructor(endpoint, token, headers={}) {
    if (!token) throw new Error('Request requires an `endpoint`.');
    if (!token) throw new Error('Request requires a `token`.');

    this._token = token;
    this._endpoint = endpoint
    this._headers = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };
  }

  onError(error) {  
    throw error;
  }

  get(path) {
    return axios.get(`${this._endpoint}${path}`, {
      headers: this._headers,
    }).catch(this.onError);
  }

  post(path, data) {
    return axios.post(`${this._endpoint}${path}`, data || {}, {
      headers: this._headers,
    }).catch(this.onError);
  }

  put(path, data) {
    return axios.put(`${this._endpoint}${path}`, data || {}, {
      headers: this._headers,
    }).catch(this.onError);
  }

  delete(path) {
    return axios.delete(`${this._endpoint}${path}`, {
      headers: this._headers,
    }).catch(this.onError);
  }
}

export default Request;
