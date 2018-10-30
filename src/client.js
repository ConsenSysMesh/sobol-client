const Core = require('./core');

class Client extends Core {
  /**
   * Extends the Core with a list of endpoints
   * @returns {object} this
   */
  constructor() {
    super();

    this.Users = {
      create: user => this._request.post(`${this._orgPath}/users`, user),
      find: () => this._request.get(`${this._orgPath}/users`),
      update: user => this._request.put(`${this._orgPath}/users/${user._id}`, user),
      delete: userId => this._request.delete(`${this._orgPath}/users/${userId}`),
    };

    this.UserProfile = {
      findById: userId => this._request.get(`${this._orgPath}/user-profile/${userId}`),
      update: userProfile => this._request.put(`${this._orgPath}/user-profile/${userProfile.userId}`, userProfile),
    };

    this.Teams = {
      create: team => this._request.post(`${this._orgPath}/teams`, team),
      find: () => this._request.get(`${this._orgPath}/teams`),
      update: team => this._request.put(`${this._orgPath}/teams/${team._id}`, team),
      delete: teamId => this._request.delete(`${this._orgPath}/teams/${teamId}`),
    };

    this.TeamProfile = {
      findById: teamId => this._request.get(`${this._orgPath}/team-profile/${teamId}`),
      update: teamProfile => this._request.put(`${this._orgPath}/team-profile/${teamProfile.teamId}`, teamProfile),
    };

    this.Roles = {
      create: role => this._request.post(`${this._orgPath}/roles`, role),
      find: () => this._request.get(`${this._orgPath}/roles`),
      update: role => this._request.put(`${this._orgPath}/roles/${role._id}`, role),
      delete: roleId => this._request.delete(`${this._orgPath}/roles/${roleId}`),
    };

    this.Goals = {
      create: goal => this._request.post(`${this._orgPath}/goals`, goal),
      find: () => this._request.get(`${this._orgPath}/goals`),
      update: goal => this._request.put(`${this._orgPath}/goals/${goal._id}`, goal),
      delete: goalId => this._request.delete(`${this._orgPath}/goals/${goalId}`),
    };

    this.Interaction = {
      create: interaction => this._request.post(`${this._orgPath}/interactions`, interaction),
      findByObject: (objectId, objectType) => this._request.get(
        `${this._orgPath}/interactions?objectType=${objectType}&objectId=${objectId}`,
      ),
    };
  }
}

module.exports = Client;
