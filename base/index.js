const Base = require('./base');
const { buildQuery } = require('./utils');

class Client extends Base {
  /**
   * AVAILABLE ENDPOINTS
   * ======================================================
   */
  constructor(...args) {
    super(args);

    /**
     * Applications
     */
    this.Applications = {
      create: (application, params) => this._request.post(`${this._orgPath}/applications${buildQuery(params)}`, application),
      find: params => this._request.get(`${this._orgPath}/applications${buildQuery(params)}`),
      findById: applicationId => this._request.get(`${this._orgPath}/applications/${applicationId}`),
      update: application => this._request.put(`${this._orgPath}/applications/${application._id}`, application),
      delete: applicationId => this._request.delete(`${this._orgPath}/applications/${applicationId}`),
      getKeys: applicationId => this._request.get(`${this._orgPath}/applications/${applicationId}/keys`),
      getKey: (applicationId, keyId) => this._request.get(`${this._orgPath}/applications/${applicationId}/keys/${keyId}`),
      createKey: (applicationId, params) => this._request.post(`${this._orgPath}/applications/${applicationId}/keys${buildQuery(params)}`),
      deleteKey: (applicationId, keyId) => this._request.delete(`${this._orgPath}/applications/${applicationId}/keys/${keyId}`),
    };

    /**
     * Users
     */
    this.Users = {
      create: user => this._request.post(`${this._orgPath}/users`, user),
      find: params => this._request.get(`${this._orgPath}/users${buildQuery(params)}`),
      findByEmail: email => this._request.get(`${this._orgPath}/users/${email}`),
      update: user => this._request.put(`${this._orgPath}/users/${user._id}`, user),
      delete: userId => this._request.delete(`${this._orgPath}/users/${userId}`),
      createBatch: users => this._request.post(`${this._orgPath}/users/batch`, users),
    };

    /**
     * User Profile
     */
    this.UserProfile = {
      findById: userId => this._request.get(`${this._orgPath}/user-profile/${userId}`),
      update: userProfile => this._request.put(`${this._orgPath}/user-profile/${userProfile.userId}`, userProfile),
    };

    /**
     * Teams
     */
    this.Teams = {
      find: params => this._request.get(`${this._orgPath}/teams${buildQuery(params)}`),
      create: team => this._request.post(`${this._orgPath}/teams`, team),
      update: team => this._request.put(`${this._orgPath}/teams/${team._id}`, team),
      delete: teamId => this._request.delete(`${this._orgPath}/teams/${teamId}`),
      updateParentTeam: (teamId, parentTeamId) => this._request.post(
        `${this._orgPath}/teams/${teamId}/parent`,
        { parentId: parentTeamId },
      ),
    };

    /**
     * Team Profile
     */
    this.TeamProfile = {
      findById: teamId => this._request.get(`${this._orgPath}/team-profile/${teamId}`),
      update: teamProfile => this._request.put(`${this._orgPath}/team-profile/${teamProfile.teamId}`, teamProfile),
    };

    /**
     * Roles
     */
    this.Roles = {
      find: params => this._request.get(`${this._orgPath}/roles${buildQuery(params)}`),
      create: role => this._request.post(`${this._orgPath}/roles`, role),
      update: role => this._request.put(`${this._orgPath}/roles/${role._id}`, role),
      delete: roleId => this._request.delete(`${this._orgPath}/roles/${roleId}`),
      assignUser: (roleId, filledById) => this._request.post(
        `${this._orgPath}/roles/${roleId}/user`,
        { filledById },
      ),
      unassignUser: roleId => this._request.delete(`${this._orgPath}/roles/${roleId}/user`),
      updateParentTeam: (roleId, teamId) => this._request.post(
        `${this._orgPath}/roles/${roleId}/parent`,
        { contributesToId: teamId },
      ),
    };

    /**
     * Goals
     */
    this.Goals = {
      find: params => this._request.get(`${this._orgPath}/goals${buildQuery(params)}`),
      create: goal => this._request.post(`${this._orgPath}/goals`, goal),
      delete: goalId => this._request.delete(`${this._orgPath}/goals/${goalId}`),
      update: goal => this._request.put(`${this._orgPath}/goals/${goal._id}`, goal),
      updateOwners: (goalId, owners) => this._request.post(`${this._orgPath}/goals/${goalId}/owners`, { owners }),
      updateTeams: (goalId, teams) => this._request.post(`${this._orgPath}/goals/${goalId}/teams`, { teams }),
    };

    /**
     * Agreements
     */
    this.Agreements = {
      find: params => this._request.get(`${this._orgPath}/agreements${buildQuery(params)}`),
      create: agreement => this._request.post(`${this._orgPath}/agreements`, agreement),
      delete: agreementId => this._request.delete(`${this._orgPath}/agreements/${agreementId}`),
      update: agreement => this._request.put(`${this._orgPath}/agreements/${agreement._id}`, agreement),
      addSignatory: (agreementId, signatory) => this._request.post(`${this._orgPath}/agreements/${agreementId}/signatories`, signatory),
      removeSignatory: (agreementId, signatory) => this._request.delete(`${this._orgPath}/agreements/${agreementId}/signatories/${signatory._id}`, {}),
      updateParties: (agreementId, parties) => this._request.post(`${this._orgPath}/agreements/${agreementId}/parties`, { parties }),
    };

    /**
     * Attachments
     */
    this.Attachments = {
      find: params => this._request.get(`${this._orgPath}/attachments${buildQuery(params)}`),
      create: attachment => this._request.post(`${this._orgPath}/attachments`, attachment),
      update: attachment => this._request.put(`${this._orgPath}/attachments/${attachment._id}`, attachment),
      delete: attachmentId => this._request.delete(`${this._orgPath}/attachments/${attachmentId}`),
    };

    /**
     * Interaction
     */
    this.Interaction = {
      find: params => this._request.get(`${this._orgPath}/interactions${buildQuery(params)}`),
      create: interaction => this._request.post(`${this._orgPath}/interactions`, interaction),
    };

    /**
     * Notifications
     */
    this.Notifications = {
      find: params => this._request.get(`${this._orgPath}/notifications${buildQuery(params)}`),
      getUnreadCount: () => this._request.get(`${this._orgPath}/notifications/unread-count`),
      markAsRead: () => this._request.post(`${this._orgPath}/notifications/markAsRead`),
      clear: () => this._request.post(`${this._orgPath}/notifications/clearAll`),
    };

    return this;
  }

  /**
   * AVAILABLE HTTP METHODS
   * ======================================================
   */

  /**
   * Makes a GET request
   * @param {string} path
   * @returns {promise} response
   */
  get(path) {
    return this._request.get(path);
  }

  /**
   * Makes a POST request
   * @param {string} path
   * @param {object} data
   * @returns {promise} response
   */
  post(path, data) {
    return this._request.post(path, data);
  }

  /**
   * Makes a PUT request
   * @param {string} path
   * @param {object} data
   * @returns {promise} response
   */
  put(path, data) {
    return this._request.put(path, data);
  }

  /**
   * Makes a DELETE request
   * @param {string} path
   * @returns {promise} response
   */
  delete(path) {
    return this._request.delete(path);
  }
}

module.exports = Client;
