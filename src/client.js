import Request from './request';
import Auth from './auth';
import pkg from '../package.json';

class Client {
  constructor(params) {
    this._pkg = pkg;
  }

  connect(params) {
    return new Promise((resolve) => {
      if (typeof params.key === 'undefined') {
        throw new Error(`Invalid Param: ${pkg.name} requires a "key".`)
      }
  
      if (typeof params.key !== 'string') {
        if (typeof params.key.kid === 'undefined' || typeof params.key.private === 'undefined' ) {
          throw new Error(`Invalid Params: ${pkg.name} RSA auth requires a "key.kid" and a "key.private".`)
        }
      }

      // properties
      this._key = params.key;
      this._protocol = params.protocol || `https`
      this._host = params.host || 'consensys-mesh.ga';
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

  _authenticate(key) {
    return this._auth.authenticate(key)
      .then((session) => {
        this._session = session;

        // handle orgIds
        if (session.orgIds.length === 1) {
          this.setOrg(session.orgIds[0]);
        } else {
          if (!session.orgIds.includes(this._orgId)) {
            throw new Error(`Invalid Param: ${pkg.name} requires a valid "orgId".`)
          }
        }
        this.setToken(session.jwt);
        return this;
      });
  }

  setKey(key) {
    this._key = key;
    return this._authenticate(key);
  }

  setOrg(orgId) {
    this._orgId = orgId;
    this._orgPath = `/org/${this._orgId}`;
  }

  setToken(token) {
    this._token = token;
    this._session.jwt = token;
    this._request.setToken(token);
  }

  getSession() {
    return this._session;
  }

  Users = {
    create: user => this._request.post(`${this._orgPath}/users`, user), // insertUser
    find: () => this._request.get(`${this._orgPath}/users`), // list
    update: user => this._request.put(`${this._orgPath}/users/${user._id}`, user),
    delete: userId => this._request.delete(`${this._orgPath}/users/${userId}`),
  };

  UserProfile = {
    findById: userId => this._request.get(`${this._orgPath}/user-profile/${userId}`), // get
    update: userProfile => this._request.put(`${this._orgPath}/user-profile/${userProfile.userId}`, userProfile),
  };

  Teams = {
    create: team => this._request.post(`${this._orgPath}/teams`, team), // insert
    find: () => this._request.get(`${this._orgPath}/teams`), // list
    update: team => this._request.put(`${this._orgPath}/teams/${team._id}`, team),
    delete: teamId => this._request.delete(`${this._orgPath}/teams/${teamId}`),
  };

  TeamProfile = {
    findById: teamId => this._request.get(`${this._orgPath}/team-profile/${teamId}`), // get
    update: teamProfile => this._request.put(`${this._orgPath}/team-profile/${teamProfile.teamId}`, teamProfile),
  };
  
  Roles = {
    create: role => this._request.post(`${this._orgPath}/roles`, role), // create
    find: () => this._request.get(`${this._orgPath}/roles`), // list
    update: role => this._request.put(`${this._orgPath}/roles/${role._id}`, role),
    delete: roleId => this._request.delete(`${this._orgPath}/roles/${roleId}`),
  };

  Goals = {
    create: goal => this._request.post(`${this._orgPath}/goals`, goal), // insert
    find: () => this._request.get(`${this._orgPath}/goals`), // list
    update: goal => this._request.put(`${this._orgPath}/goals/${goal._id}`, goal),
    delete: goalId => this._request.delete(`${this._orgPath}/goals/${goalId}`),
  };

  Interaction = {
    create: interaction => this._request.post(`${this._orgPath}/interactions`, interaction), // insert
    findByObject: (objectId, objectType) => this._request.get(
      `${this._orgPath}/interactions?objectType=${objectType}&objectId=${objectId}`), // listForObject
  };
}

export default new Client();
