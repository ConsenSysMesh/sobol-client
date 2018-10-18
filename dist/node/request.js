"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _axios = _interopRequireDefault(require("axios"));var

Request = /*#__PURE__*/function () {
  function Request(endpoint) {var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var token = arguments.length > 2 ? arguments[2] : undefined;(0, _classCallCheck2.default)(this, Request);
    if (!endpoint) throw new Error('Request requires an `endpoint`.');
    this._endpoint = endpoint;
    this._headers = headers;

    if (token) {
      this.setToken(token);
    }
  }(0, _createClass2.default)(Request, [{ key: "_handleError", value: function _handleError(

    error) {
      throw error;
    } }, { key: "setToken", value: function setToken(

    token) {
      this._token = token;
      this._headers = (0, _objectSpread2.default)({
        Authorization: "Bearer ".concat(token) },
      this._headers);

    } }, { key: "get", value: function get(

    path) {
      return _axios.default.get("".concat(this._endpoint).concat(path), {
        headers: this._headers }).
      catch(this._handleError);
    } }, { key: "post", value: function post(

    path, data) {
      return _axios.default.post("".concat(this._endpoint).concat(path), data || {}, {
        headers: this._headers }).
      catch(this._handleError);
    } }, { key: "put", value: function put(

    path, data) {
      return _axios.default.put("".concat(this._endpoint).concat(path), data || {}, {
        headers: this._headers }).
      catch(this._handleError);
    } }, { key: "delete", value: function _delete(

    path) {
      return _axios.default.delete("".concat(this._endpoint).concat(path), {
        headers: this._headers }).
      catch(this._handleError);
    } }]);return Request;}();var _default =


Request;exports.default = _default;