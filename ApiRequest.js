import axios from 'axios';
import history from 'routing/history';
import { message } from 'antd';
import { API_URL } from 'config/env';

const _handleError = (err) => {
  if (err && err.response) {
    if (err.response.status === 403) {
      // TODO: use a server-side generated error msg instead of this custom one.
      message.warning('Access not granted, please log in.');
      // TODO: think this through. User may attempt an operation they're not allowed to due to
      // a bug but still be authenticated.
      history.replace('/login');
    } else {
      // TODO: update this logic when we have a json object for API responses
      // app-specific error returned by the server
      message.warning(err.response.data);
    }
  } else {
    // Fallback - default axios error msg on non-200 responses
    message.error(err.message.toString());
  }
  throw err;
};

class ApiRequest {
  _authHeaders;

  setAuthHeaders(authHeaders) {
    this._authHeaders = authHeaders;
  }

  get(url) {
    return axios.get(`${API_URL}${url}`, {
      headers: this._authHeaders,
    }).catch(_handleError);
  }

  post(url, data) {
    return axios.post(`${API_URL}${url}`, data || {}, { headers: this._authHeaders })
      .catch(_handleError);
  }

  put(url, data) {
    return axios.put(`${API_URL}${url}`, data || {}, { headers: this._authHeaders })
      .catch(_handleError);
  }

  delete(url) {
    return axios.delete(`${API_URL}${url}`, { headers: this._authHeaders })
      .catch(_handleError);
  }
}

export default new ApiRequest();
