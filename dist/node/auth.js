"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _request = _interopRequireDefault(require("./request"));
var _crypto = require("crypto");
var _jsonwebtoken = require("jsonwebtoken");var

Auth = /*#__PURE__*/function () {
  function Auth(endpoint) {(0, _classCallCheck2.default)(this, Auth);
    if (!endpoint) throw new Error('Auth requires an `endpoint`.');
    this._endpoint = endpoint;
    this._request = new _request.default(endpoint);
  }(0, _createClass2.default)(Auth, [{ key: "authenticate", value: function authenticate(

    key) {
      this._key = key;

      if (typeof key === 'string') {
        return this._verifyJwt(this._key);
      }

      return this._authenticateRsa();
    } }, { key: "_authenticateRsa", value: function _authenticateRsa()

    {var _this = this;
      return this._signRsa(this._key.kid, this._key.private).
      then(function (signature) {return _this._getJwt(signature);}).
      then(function (encodedJwt) {
        var decodedJwt = (0, _jsonwebtoken.decode)(encodedJwt);
        return (0, _objectSpread2.default)({}, decodedJwt, { jwt: encodedJwt });
      });
    } }, { key: "_signRsa", value: function _signRsa(

    message, privateKey) {
      return new Promise(function (resolve) {
        var signer = (0, _crypto.createSign)('RSA-SHA256');
        signer.update(message);
        signer.end();
        var signature = signer.sign(privateKey, 'base64');
        resolve(signature);
      });
    } }, { key: "_getJwt", value: function _getJwt(

    signature) {
      return this._request.post("/login/", {
        type: 'rsa',
        authorization: {
          signature: signature,
          kid: this._key.kid,
          alg: 'rsa-sha256',
          sig: 'base64' } }).


      then(function (response) {return response.data;});
    } }, { key: "_verifyJwt", value: function _verifyJwt(

    encodedJwt) {var _this2 = this;
      return new Promise(function (resolve, reject) {
        _this2._request.get('/login/jwt-public-key').
        then(function (response) {
          var privateKey = response.data.keys[0].key;

          (0, _jsonwebtoken.verify)(
          encodedJwt,
          privateKey,
          { algorithms: ['RS256'] },
          function (err, decodedJwt) {
            if (err) {
              reject(err);
            } else {
              resolve((0, _objectSpread2.default)({}, decodedJwt, { jwt: encodedJwt }));
            }
          });

        });
      });
    } }]);return Auth;}();var _default =


Auth;exports.default = _default;