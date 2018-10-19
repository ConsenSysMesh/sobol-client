import Request from './request';
import { createSign } from 'crypto';
import { decode, verify } from 'jsonwebtoken';

class Auth {
  constructor(endpoint) {
    if (!endpoint) throw new Error('Auth requires an `endpoint`.');
    this._endpoint = endpoint;
    this._request = new Request(endpoint);
  }

  authenticate(key) {
    this._key = key;

    if (typeof key === 'string') {
      return this._verifyJwt(this._key);
    }
    
    return this._authenticateRsa();
  }

  _decodeKey(key) {
    return Buffer.from(key, 'base64').toString('ascii');
  }

  _authenticateRsa() {
    return this._signRsa(this._key.kid, this._key.private)
      .then(signature => this._getJwt(signature))
      .then(encodedJwt => {
        const decodedJwt = decode(encodedJwt);
        return { ...decodedJwt, jwt: encodedJwt }
      });
  }

  _signRsa(message, privateKey) {
    return new Promise((resolve) => {
      const signer = createSign('RSA-SHA256');
      signer.update(message);
      signer.end();
      const signature = signer.sign(this._decodeKey(privateKey), 'base64');
      resolve(signature);
    });
  }

  _getJwt(signature) {
    return this._request.post(`/login/`, {
      type: 'rsa',
      authorization: {
        signature,
        kid: this._key.kid,
        alg: 'rsa-sha256',
        sig: 'base64'
      }
    })
      .then(response => response.data);
  }

  _verifyJwt(encodedJwt) {
    return new Promise((resolve, reject) => {
      this._request.get('/login/jwt-public-key')
        .then((response) => {
          const privateKey = response.data.keys[0].key;

          verify(
            encodedJwt,
            privateKey,
            { algorithms: ['RS256'] },
            (err, decodedJwt) => {
              if (err) {
                reject(err);
              } else {
                resolve({ ...decodedJwt, jwt: encodedJwt });
              }
            }
          );
        });
    });
  }
}

export default Auth;
