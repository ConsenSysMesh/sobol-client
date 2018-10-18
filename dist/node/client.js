"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _request = _interopRequireDefault(require("./request"));
var _auth = _interopRequireDefault(require("./auth"));
var _package = _interopRequireDefault(require("../package.json"));var

Client = /*#__PURE__*/function () {
  function Client(params) {var _this = this;(0, _classCallCheck2.default)(this, Client);(0, _defineProperty2.default)(this, "Users",









































































    {
      create: function create(user) {return _this._request.post("".concat(_this._orgPath, "/users"), user);}, // insertUser
      find: function find() {return _this._request.get("".concat(_this._orgPath, "/users"));}, // list
      update: function update(user) {return _this._request.put("".concat(_this._orgPath, "/users/").concat(user._id), user);},
      delete: function _delete(userId) {return _this._request.delete("".concat(_this._orgPath, "/users/").concat(userId));} });(0, _defineProperty2.default)(this, "UserProfile",


    {
      findById: function findById(userId) {return _this._request.get("".concat(_this._orgPath, "/user-profile/").concat(userId));}, // get
      update: function update(userProfile) {return _this._request.put("".concat(_this._orgPath, "/user-profile/").concat(userProfile.userId), userProfile);} });(0, _defineProperty2.default)(this, "Teams",


    {
      create: function create(team) {return _this._request.post("".concat(_this._orgPath, "/teams"), team);}, // insert
      find: function find() {return _this._request.get("".concat(_this._orgPath, "/teams"));}, // list
      update: function update(team) {return _this._request.put("".concat(_this._orgPath, "/teams/").concat(team._id), team);},
      delete: function _delete(teamId) {return _this._request.delete("".concat(_this._orgPath, "/teams/").concat(teamId));} });(0, _defineProperty2.default)(this, "TeamProfile",


    {
      findById: function findById(teamId) {return _this._request.get("".concat(_this._orgPath, "/team-profile/").concat(teamId));}, // get
      update: function update(teamProfile) {return _this._request.put("".concat(_this._orgPath, "/team-profile/").concat(teamProfile.teamId), teamProfile);} });(0, _defineProperty2.default)(this, "Roles",


    {
      create: function create(role) {return _this._request.post("".concat(_this._orgPath, "/roles"), role);}, // create
      find: function find() {return _this._request.get("".concat(_this._orgPath, "/roles"));}, // list
      update: function update(role) {return _this._request.put("".concat(_this._orgPath, "/roles/").concat(role._id), role);},
      delete: function _delete(roleId) {return _this._request.delete("".concat(_this._orgPath, "/roles/").concat(roleId));} });(0, _defineProperty2.default)(this, "Goals",


    {
      create: function create(goal) {return _this._request.post("".concat(_this._orgPath, "/goals"), goal);}, // insert
      find: function find() {return _this._request.get("".concat(_this._orgPath, "/goals"));}, // list
      update: function update(goal) {return _this._request.put("".concat(_this._orgPath, "/goals/").concat(goal._id), goal);},
      delete: function _delete(goalId) {return _this._request.delete("".concat(_this._orgPath, "/goals/").concat(goalId));} });(0, _defineProperty2.default)(this, "Interaction",


    {
      create: function create(interaction) {return _this._request.post("".concat(_this._orgPath, "/interactions"), interaction);}, // insert
      findByObject: function findByObject(objectId, objectType) {return _this._request.get("".concat(
        _this._orgPath, "/interactions?objectType=").concat(objectType, "&objectId=").concat(objectId));} // listForObject
    });this._pkg = _package.default;}(0, _createClass2.default)(Client, [{ key: "connect", value: function connect(params) {var _this2 = this;return new Promise(function (resolve) {if (typeof params.key === 'undefined') {throw new Error("Invalid Param: ".concat(_package.default.name, " requires a \"key\"."));}if (typeof params.key !== 'string') {if (typeof params.key.kid === 'undefined' || typeof params.key.private === 'undefined') {throw new Error("Invalid Params: ".concat(_package.default.name, " RSA auth requires a \"key.kid\" and a \"key.private\"."));}} // properties
        _this2._key = params.key;_this2._protocol = params.protocol || "https";_this2._host = params.host || 'consensys-mesh.ga';_this2._namespace = params.namespace || 'api';_this2._version = params.version || 'v1';_this2._endpoint = params.endpoint || "".concat(_this2._protocol, "://").concat(_this2._host, "/").concat(_this2._namespace, "/").concat(_this2._version); // setters
        _this2.setOrg(params.orgId); // libaries
        _this2._request = new _request.default(_this2._endpoint);_this2._auth = new _auth.default(_this2._endpoint); // authenticate
        resolve(_this2._authenticate(_this2._key));});} }, { key: "_authenticate", value: function _authenticate(key) {var _this3 = this;return this._auth.authenticate(key).then(function (session) {_this3._session = session; // handle orgIds
        if (session.orgIds.length === 1) {_this3.setOrg(session.orgIds[0]);} else {if (!session.orgIds.includes(_this3._orgId)) {throw new Error("Invalid Param: ".concat(_package.default.name, " requires a valid \"orgId\"."));}}_this3.setToken(session.jwt);return _this3;});} }, { key: "setKey", value: function setKey(key) {this._key = key;return this._authenticate(key);} }, { key: "setOrg", value: function setOrg(orgId) {this._orgId = orgId;this._orgPath = "/org/".concat(this._orgId);} }, { key: "setToken", value: function setToken(token) {this._token = token;this._session.jwt = token;this._request.setToken(token);} }, { key: "getSession", value: function getSession() {return this._session;} }]);return Client;}();var _default = new Client();exports.default = _default;