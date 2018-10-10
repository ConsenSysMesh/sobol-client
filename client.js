import ApiRequest from 'api-client/ApiRequest';
import buildQuery from 'api-client/feed/buildQuery';
import Axios from 'axios';

export default (function _() {
  class ApiClient {
    _rootId = null;

    constructor() {
      this._globalRoute = route => `${route}`;
      this._localRoute = route => `/org/${this._rootId}${route}`;
    }

    setRootId(rootId) {
      this._rootId = rootId;
    }

    // Global routes (not org-specific)

    GlobalUsers = {
      list: () => ApiRequest.get(this._globalRoute('/users')),
      getCurrentUser: () => ApiRequest.get(this._globalRoute('/users/current')),
      // TODO: there is no global user update route defined ATM
      update: user => ApiRequest.put(this._globalRoute('/users'), user),
      changeOrg: (userId, rootId) => ApiRequest.put(this._globalRoute(`/users/changeOrg/${userId}`), { userId, rootId }),
    };
    Login = {
      getJwt: idToken => ApiRequest.post(this._globalRoute('/login'), idToken),
      getJWTPublicKey: () => ApiRequest.get(this._globalRoute('/login/jwt-public-key')),
    };
    RootOrgs = {
      list: () => ApiRequest.get(this._globalRoute('/root-orgs')),
      listForUser: () => ApiRequest.get(this._globalRoute('/root-orgs/current-user')),
    };

    // Local (org-specific routes)

    Users = {
      checkDuplicateEmail: email => ApiRequest.get(this._localRoute(`/users/checkDuplicateEmail/${email}`)),
      findByGlobalId: globalId => ApiRequest.get(this._localRoute(`/users?globalId=${globalId}`)),
      list: () => ApiRequest.get(this._localRoute('/users')),
      getDetails: userId => ApiRequest.get(this._localRoute(`/users/${userId}/details`)),
      delete: userId => ApiRequest.delete(this._localRoute(`/users/${userId}`)),
      insertUser: user => ApiRequest.post(this._localRoute('/users'), user),
      update: user => ApiRequest.put(this._localRoute(`/users/${user._id}`), user),
    };
    Teams = {
      list: () => ApiRequest.get(this._localRoute('/teams')),
      insert: team => ApiRequest.post(this._localRoute('/teams'), team),
      update: team => ApiRequest.put(this._localRoute(`/teams/${team._id}`), team),
      delete: teamId => ApiRequest.delete(this._localRoute(`/teams/${teamId}`)),
      updateParentTeam: (teamId, parentTeamId) =>
        ApiRequest.post(this._localRoute(`/teams/${teamId}/parent`), { parentId: parentTeamId }),
    };
    Roles = {
      list: () => ApiRequest.get(this._localRoute('/roles')),
      insert: role => ApiRequest.post(this._localRoute('/roles'), role),
      update: role => ApiRequest.put(this._localRoute(`/roles/${role._id}`), role),
      delete: roleId => ApiRequest.delete(this._localRoute(`/roles/${roleId}`)),
      assignUser: (roleId, filledById) =>
        ApiRequest.post(this._localRoute(`/roles/${roleId}/user`), { filledById }),
      unassignUser: roleId => ApiRequest.delete(this._localRoute(`/roles/${roleId}/user`)),
      updateParentTeam: (roleId, teamId) =>
        ApiRequest.post(this._localRoute(`/roles/${roleId}/parent`), { contributesToId: teamId }),
    };
    Goals = {
      list: () => ApiRequest.get(this._localRoute('/goals')),
      fetch: goalIds => ApiRequest.get(this._localRoute(`/goals?ids=${goalIds.join()}`)),
      insert: goal => ApiRequest.post(this._localRoute('/goals'), goal),
      delete: goalId => ApiRequest.delete(this._localRoute(`/goals/${goalId}`)),
      update: goal => ApiRequest.put(this._localRoute(`/goals/${goal._id}`), goal),
      updateOwners: (goalId, owners) => ApiRequest.post(this._localRoute(`/goals/${goalId}/owners`), { owners }),
      updateTeams: (goalId, teams) => ApiRequest.post(this._localRoute(`/goals/${goalId}/teams`), { teams }),
    };
    GoalLayouts = {
      get: (objectIds, objectType) => ApiRequest.get(this._localRoute(`/goal-layouts?objectType=${objectType}&objectIds=${objectIds.join()}`)),
      update: layout => ApiRequest.put(this._localRoute(`/goal-layouts/${layout._id}`), layout),
    };
    Attachments = {
      fetchAttachments: object => ApiRequest.get(this._localRoute(`/attachments?objectType=${object.objectType}&objectId=${object.objectId}`)),
      deleteAttachment: attachment => ApiRequest.delete(this._localRoute(`/attachments/${attachment._id}`)),
      updateAttachment: attachment => ApiRequest.put(this._localRoute(`/attachments/${attachment._id}`), attachment),
      addAttachment: attachment => ApiRequest.post(this._localRoute('/attachments'), attachment),
    };
    Feed = {
      filterItems: params => ApiRequest.get(this._localRoute(buildQuery('find', params))),
    };
    TeamProfile = {
      get: teamId => ApiRequest.get(this._localRoute(`/team-profile/${teamId}`)),
      update: teamProfile => ApiRequest.put(this._localRoute(`/team-profile/${teamProfile.teamId}`), teamProfile),
    };
    UserProfile = {
      get: userId => ApiRequest.get(this._localRoute(`/user-profile/${userId}`)),
      update: userProfile => ApiRequest.put(this._localRoute(`/user-profile/${userProfile.userId}`), userProfile),
    };
    Interaction = {
      insert: interaction => ApiRequest.post(this._localRoute('/interactions'), interaction),
      listForObject: (objectId, objectType) => ApiRequest.get(this._localRoute(
        `/interactions?objectType=${objectType}&objectId=${objectId}`)),
    };
    Notifications = {
      list: () => ApiRequest.get(this._localRoute('/notifications')),
      getUnreadCount: () => ApiRequest.get(this._localRoute('/notifications/unread-count')),
      markAsRead: () => ApiRequest.post(this._localRoute('/notifications/markAsRead')),
      clear: () => ApiRequest.post(this._localRoute('/notifications/clearAll')),
    };
    S3 = {
      getUploadURL: (fileName, fileType) =>
        ApiRequest.get(this._localRoute(`/s3/getUploadUrl?fileName=${fileName}&fileType=${fileType}`)),
      uploadFile: (uploadUrl, file, fileType = file.type) =>
        Axios.put(uploadUrl, file, {
          headers: { 'Content-Type': fileType },
        }),
    }
  }

  let instance;
  return {
    getInstance() {
      if (instance == null) {
        instance = new ApiClient();
        // hide constructor
        instance.constructor = null;
      }
      return instance;
    },
  };
}());