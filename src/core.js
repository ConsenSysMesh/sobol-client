const Auth = require('./auth');
const Request = require('./request');
const pkg = require('../package.json');

class Core {
  /**
   * Provides the core functionality of the client
   * @returns {object} this
   */
  constructor() {
    this._pkg = {
      name: pkg.name,
      version: pkg.version,
    };

    return this;
  }

  /**
   * Authenticates key and issues a new session
   * @param {string | object} key
   * @returns {object} this
   */
  _authenticate(key) {
    return this._auth.authenticate(key)
      .then((session) => {
        this._session = session;

        // handle orgIds
        // - if there is one, use it
        // - if there are multiple, enforce this._orgId
        if (session.orgIds.length === 1) {
          this.setOrg(session.orgIds[0]);
        } else if (!session.orgIds.includes(this._orgId)) {
          throw new Error(`Invalid Param: ${this._pkg.name} requires a valid "orgId".`);
        }
        this.setToken(session.jwt);
        return this;
      });
  }

  /**
   * Creates a new session
   * @param {object} params
   * @returns {promise} client
   */
  connect(params) {
    return new Promise((resolve) => {
      if (typeof params.key === 'undefined') {
        throw new Error(`Invalid Param: ${this._pkg.name} requires a "key".`);
      }

      if (typeof params.key !== 'string') {
        if (typeof params.key.kid === 'undefined' || typeof params.key.private === 'undefined') {
          throw new Error(`Invalid Params: ${this._pkg.name} RSA auth requires a "key.kid" and a "key.private".`);
        }
      }

      // properties
      this._key = params.key;
      this._protocol = params.protocol || 'https';
      this._host = params.host || 'sobol.io/d';
      this._namespace = params.namespace || 'api';
      this._version = params.version || 'v1';
      this._endpoint = params.endpoint || `${this._protocol}://${this._host}/${this._namespace}/${this._version}`;

      // setters
      this.setOrg(params.orgId);

      // libaries
      this._request = new Request(this._endpoint);
      this._auth = new Auth(this._endpoint);

      // authenticate
      resolve(this._authenticate(this._key));
    });
  }

  /**
   * Invalidates current session
   * @returns {object} this
   */
  disconnect() {
    this.setKey(null);
    this.setToken(null);
    this.setOrg(null);
    this._auth.deauthenticate();
    this._session = null;
    return this;
  }

  /**
   * Sets a new key and re-authenticates the client
   * @param {string | object} key
   * @returns {promise} client
   */
  setKey(key) {
    this._key = key;
    if (key) {
      return this._authenticate(key);
    }

    return Promise.resolve();
  }

  /**
   * Sets a new access token
   * @param {string} token
   * @returns {void}
   */
  setToken(token) {
    this._token = token;
    this._request.setToken(token);
    if (this._session) this._session.jwt = token;
  }

  /**
   * Sets a new org ID
   * @param {string} orgId
   * @returns {void}
   */
  setOrg(orgId) {
    this._orgId = orgId;
    this._orgPath = (orgId ? `/org/${this._orgId}` : null);
  }

  /**
   * Gets the current session
   * @returns {object} session
   */
  getSession() {
    return this._session;
  }

  /**
   * Gets the current version of the client
   * @returns {string} version
   */
  getVersion() {
    return this._version;
  }
}

module.exports = Core;
