const decode = require('jwt-decode');
const { PKG_NAME } = require('./constants');

class Auth {
  /**
   * Authenticate the client
   * @param {string} key
   * @returns {promise} session
   */
  authenticate(key) {
    return new Promise((resolve) => {
      if (key && key.kid) {
        throw new Error(`[${PKG_NAME}] ... RSA keys have been deprecated. Please transition to API keys.`);
      }

      if (typeof key !== 'string') {
        throw new Error(`[${PKG_NAME}] ... auth requires the "key" is a JWT`);
      }

      const session = decode(key);
      this._setSession(session);
      resolve(session);
    });
  }

  /**
   * Deauthenticates a strategy
   * @returns {promise}
   */
  deauthenticate() {
    return new Promise((resolve) => {
      this._setSession(null);
      resolve();
    });
  }

  /**
   * Gets the current session
   * @returns {object} session
   */
  getSession() {
    return this._session;
  }

  /**
   * PRIVATE METHODS
   * ======================================================
   */

  /**
   * Sets a current session
   * @params {object} session
   * @returns {object} new session
   */
  _setSession(session) {
    this._session = session;
    return this._session;
  }
}

module.exports = Auth;
