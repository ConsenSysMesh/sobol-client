import Request from 'sobol-client/src/request';
import Endpoints from 'sobol-client/src/endpoints';

class Client {
  constructor(params) {
    if (!token) throw new Error('Sobol Client requires a `token`.');
  
    this._token = params.token;
    this._protocol = params.protocol || `https`
    this._host = params.host || 'consensys-mesh.ga';
    this._namespace = params.namespace || 'api';
    this._version = params.version || 'v1';
    this._endpoint = params.endpoint || `${this._protocol}://${this._host}/${this._namespace}/${this._version}`

    this.setToken(this._token);
  }

  setToken(token) {
    this._request = new Request(this._endpoint, token);
  }

  Users = {
    create: user => this._request.post(this._localRoute('/users'), user), // insertUser
    find: () => this._request.get(this._localRoute('/users')), // list
    update: user => this._request.put(this._localRoute(`/users/${user._id}`), user),
    delete: userId => this._request.delete(this._localRoute(`/users/${userId}`)),
  };

  UserProfile = {
    findById: userId => this._request.get(this._localRoute(`/user-profile/${userId}`)), // get
    update: userProfile => this._request.put(this._localRoute(`/user-profile/${userProfile.userId}`), userProfile),
  };

  Teams = {
    create: team => this._request.post(this._localRoute('/teams'), team), // insert
    find: () => this._request.get(this._localRoute('/teams')), // list
    update: team => this._request.put(this._localRoute(`/teams/${team._id}`), team),
    delete: teamId => this._request.delete(this._localRoute(`/teams/${teamId}`)),
  };

  TeamProfile = {
    findById: teamId => this._request.get(this._localRoute(`/team-profile/${teamId}`)), // get
    update: teamProfile => this._request.put(this._localRoute(`/team-profile/${teamProfile.teamId}`), teamProfile),
  };
  
  Roles = {
    create: role => this._request.post(this._localRoute('/roles'), role), // create
    find: () => this._request.get(this._localRoute('/roles')), // list
    update: role => this._request.put(this._localRoute(`/roles/${role._id}`), role),
    delete: roleId => this._request.delete(this._localRoute(`/roles/${roleId}`)),
  };

  Goals = {
    create: goal => this._request.post(this._localRoute('/goals'), goal), // insert
    find: () => this._request.get(this._localRoute('/goals')), // list
    update: goal => this._request.put(this._localRoute(`/goals/${goal._id}`), goal),
    delete: goalId => this._request.delete(this._localRoute(`/goals/${goalId}`)),
  };

  Interaction = {
    create: interaction => this._request.post(this._localRoute('/interactions'), interaction), // insert
    findByObject: (objectId, objectType) => this._request.get(this._localRoute(
      `/interactions?objectType=${objectType}&objectId=${objectId}`)), // listForObject
  };
}

export default Client;
