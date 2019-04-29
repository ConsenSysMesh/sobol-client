const Request = require('./request');
const Auth = require('./auth');
const {
  PKG_NAME,
  VERSION,
  API_ENDPOINT,
} = require('./constants');

const { warn } = console;

class Base {
  /**
   * AVAILABLE ENDPOINTS
   * ======================================================
   */
  constructor() {
    this._isInitializing = true;

    return this;
  }

  /**
   * LIFECYCLE METHODS
   * ======================================================
   */

  /**
   * Configures / reconfigures the client
   *
   * @param {object} params
   *
   * {
   *   key: LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUpR...,
   *   endpoint: 'http://localhost/api/v1/',
   *   headers: {},
   *   orgId: 'ConsenSys',
   *   errorHandler: SomeHandler,
   * }
   *
   * @returns {promise} client
   */
  configure(params) {
    return new Promise((resolve) => {
      if (params.protocol) this._dreprecateProp('protocol', 'endpoint');
      if (params.host) this._dreprecateProp('host', 'endpoint');
      if (params.namespace) this._dreprecateProp('namespace', 'endpoint');
      if (params.version) this._dreprecateProp('version', 'endpoint');

      // configure core
      this._key = params.key || this._key || null;
      this._endpoint = params.endpoint || this._endpoint || API_ENDPOINT;
      this._headers = params.headers || this._headers || null;
      this._orgId = params.orgId || this.orgId || null;
      this._errorHandler = params.errorHandler || this._errorHandler || null;

      if (this._isInitializing) {
        this._request = new Request();
        this._auth = new Auth();
      }

      // configure request
      if (this._isInitializing ||
          params.endpoint ||
          params.headers ||
          params.errorHandler
      ) {
        this._request.configure({
          endpoint: this._endpoint,
          headers: this._headers,
          errorHandler: this._errorHandler,
        });
      }

      // set state
      this._isInitializing = false;

      // configure session
      if (params.key || params.orgId) {
        resolve(this._authenticate(this._key, params.orgId));
      } else {
        resolve(this);
      }
    });
  }

  /**
   * Invalidates current session
   * @returns {object} this
   */
  destroy() {
    this._auth.deauthenticate();
    this._request.destroy();
    this._setOrg(null);
    this._key = null;
    return this;
  }

  /**
   * INFO METHODS
   * ======================================================
   */

  /**
   * Gets the current session
   * @returns {object} session
   */
  getSession() {
    if (this._isInitializing) {
      warn(`[${PKG_NAME}] ... run "configure()" to set a session before running "getSession()"`);
    }
    return this._auth.getSession();
  }

  /**
   * Gets the raw jwt - useful for generating authenticated links
   * @returns {string} key
   */
  getKey() {
    if (this._isInitializing) {
      warn(`[${PKG_NAME}] ... run "configure()" to set a key before running "getKey()"`);
    }
    return this._key;
  }

  /**
   * Gets the orgId
   * @returns {string} orgId
   */
  getOrgId() {
    if (this._isInitializing) {
      warn(`[${PKG_NAME}] ... run "configure()" to set a key before running "getOrgId()"`);
    }
    return this._orgId;
  }

  /**
   * Gets the current version of the client
   * @returns {string} version
   */
  getVersion() {
    return VERSION;
  }

  /**
   * PRIVATE METHODS
   * ======================================================
   */

  /**
   * Sets a new org ID from a list of orgs
   * - if there is one, use it
   * - if there are multiple, enforce this._orgId
   * - if there are multiple and this._orgId, use it
   *
   * @param {array} orgIds
   * @returns {void}
   */
  _handleOrgs(orgIds, orgId) {
    // if passed an orgId, set it
    if (orgId) {
      this._setOrg(orgId);

    // if there is only one, set it
    } else if (orgIds.length === 1) {
      this._setOrg(orgIds[0]);

    // if orgId is found in orgIds, use it
    } else if (orgIds.includes(this._orgId)) {
      this._setOrg(this._orgId);

    // default
    } else {
      throw new Error(`[${PKG_NAME}] ... requires a valid "orgId" param.`);
    }
  }

  /**
   * Sets a new org ID
   * @param {string} orgId
   * @returns {void}
   */
  _setOrg(orgId) {
    this._orgId = orgId;
    this._orgPath = (orgId ? `/org/${this._orgId}` : '');
  }

  /**
   * Issues a new session and sets the org and token ids
   * @param {string | object} key
   * @returns {object} this
   */
  _authenticate(key, orgId) {
    if (key) {
      return this._auth.authenticate(key)
        .then((session) => {
          this._handleOrgs(session.orgIds || [session.oid], orgId);
          this._request.configure({
            key,
          });
          return this;
        });
    }

    return this;
  }

  /**
   * Handles deprecated properties
   * @param {string} method
   * @param {object} params
   * @returns {promise} newMethod
   */
  _dreprecateProp(prop, newProp) {
    warn(`[${PKG_NAME}] ... "${prop}" property has been deprecated. Please use the "${newProp}" property instead.`);
  }

  /**
   * Handles deprecated methods
   * @param {string} method
   * @param {object} params
   * @returns {promise} newMethod
   */
  _deprecateMethod(method, newMethod, params) {
    warn(`[${PKG_NAME}] ... "${method}()" has been deprecated. Please use the "${newMethod}({ ... })" method instead.`);
    return this[newMethod](params);
  }

  /**
   * DEPRECATED METHODS
   * ======================================================
   */
  connect(params) {
    return this._deprecateMethod('connect', 'configure', params);
  }

  disconnect() {
    return this._deprecateMethod('disconnect', 'destroy');
  }

  setKey(key) {
    return this._deprecateMethod('setKey', 'configure', {
      key,
    });
  }

  setToken(token) {
    return this._deprecateMethod('setToken', 'configure', {
      key: token,
    });
  }

  setOrg(orgId) {
    return this._deprecateMethod('setOrg', 'configure', {
      orgId,
    });
  }
}

module.exports = Base;
