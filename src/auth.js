const { createSign } = require('crypto');
const { decode, verify } = require('jsonwebtoken');
const Request = require('./request');

class Auth {
  /**
   * Employs cryptographic key signing to get a session
   * @param {string} endpoint (required)
   * @returns {object} this
   */
  constructor(endpoint) {
    if (!endpoint) throw new Error('Auth requires an `endpoint`.');
    this._endpoint = endpoint;
    this._request = new Request(endpoint);
    return this;
  }

  /**
   * Determines authentication strategy
   * @param {object | string} key
   * @returns {promise} session
   */
  authenticate(key) {
    this._key = key;

    if (typeof key === 'string') {
      return this._verifyJwt(this._key);
    }

    return this._authenticateRsa();
  }

  /**
   * Deauthenticates the session
   * @returns {void}
   */
  deauthenticate() {
    this._key = null;
  }

  /**
   * Decodes a base64 encoded string to ascii
   * @param {string} key (base64)
   * @returns {string} key (ascii)
   */
  _decodeKey(key) {
    return Buffer.from(key, 'base64').toString('ascii');
  }

  /**
   * Authenticates using RSA key signing
   * @returns {promise} session
   */
  _authenticateRsa() {
    const timestamp = Date.now();
    return this._signRsa(this._key.kid, timestamp, this._key.private)
      .then(signature => this._getJwt(signature, timestamp))
      .then((encodedJwt) => {
        const decodedJwt = decode(encodedJwt);
        return { ...decodedJwt, jwt: encodedJwt };
      });
  }

  /**
   * Generates a RSA signature
   * @param {string} message
   * @param {date} timestamp
   * @param {string} privateKey
   * @returns {promise} signature
   */
  _signRsa(message, timestamp, privateKey) {
    return new Promise((resolve) => {
      const signer = createSign('RSA-SHA256');
      signer.update(message + timestamp);
      signer.end();
      const signature = signer.sign(this._decodeKey(privateKey), 'base64');
      resolve(signature);
    });
  }

  /**
   * Validates signature with API and gets back a JWT
   * @param {string} signature
   * @param {date} timestamp
   * @returns {promise} encodedJwt
   */
  _getJwt(signature, timestamp) {
    return this._request.post('/login/', {
      type: 'rsa',
      authorization: {
        signature,
        timestamp,
        kid: this._key.kid,
        alg: 'rsa-sha256',
        sig: 'base64',
      },
    })
      .then(response => response.data);
  }

  /**
   * Verifies if the supplied JWT is valid
   * @param {string} encodedJwt
   * @returns {promise} session
   */
  _verifyJwt(encodedJwt) {
    return new Promise((resolve, reject) => {
      this._request.get('/login/jwt-public-key')
        .then((response) => {
          const publicKey = response.data.keys[0].key;

          verify(
            encodedJwt,
            publicKey,
            { algorithms: ['RS256'] },
            (err, decodedJwt) => {
              if (err) {
                reject(err);
              } else {
                resolve({ ...decodedJwt, jwt: encodedJwt });
              }
            },
          );
        });
    });
  }
}

module.exports = Auth;
