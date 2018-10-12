export default class Endpoints {
  users = {
    create: user => this._request.post(this._localRoute('/users'), user), // insertUser
    find: () => this._request.get(this._localRoute('/users')), // list
    update: user => this._request.put(this._localRoute(`/users/${user._id}`), user),
    delete: userId => this._request.delete(this._localRoute(`/users/${userId}`)),
  };

  teams = {
    create: team => this._request.post(this._localRoute('/teams'), team), // insert
    find: () => this._request.get(this._localRoute('/teams')), // list
    update: team => this._request.put(this._localRoute(`/teams/${team._id}`), team),
    delete: teamId => this._request.delete(this._localRoute(`/teams/${teamId}`)),
  };

  teamProfile = {
    findById: teamId => this._request.get(this._localRoute(`/team-profile/${teamId}`)), // get
    update: teamProfile => this._request.put(this._localRoute(`/team-profile/${teamProfile.teamId}`), teamProfile),
  };
  
  roles = {
    create: role => this._request.post(this._localRoute('/roles'), role), // create
    find: () => this._request.get(this._localRoute('/roles')), // list
    update: role => this._request.put(this._localRoute(`/roles/${role._id}`), role),
    delete: roleId => this._request.delete(this._localRoute(`/roles/${roleId}`)),
  };

  goals = {
    create: goal => this._request.post(this._localRoute('/goals'), goal), // insert
    find: () => this._request.get(this._localRoute('/goals')), // list
    update: goal => this._request.put(this._localRoute(`/goals/${goal._id}`), goal),
    delete: goalId => this._request.delete(this._localRoute(`/goals/${goalId}`)),
  };


}





import request from 'this._request';
this._request.setAuthHeaders(this.getAuthHeaders());

// supported methods

// create
// find
// findById
// findByObject
// update
// delete

export default Login = {
  getJwt: idToken => this._request.post(this._globalRoute('/login'), idToken), // getJwt
  getJWTPublicKey: () => this._request.get(this._globalRoute('/login/jwt-public-key')),
};

export default RootOrgs = {
  find: () => this._request.get(this._globalRoute('/root-orgs')), // list
  listForUser: () => this._request.get(this._globalRoute('/root-orgs/current-user')), // getForUser
};

export default GlobalUsers = {
  find: () => this._request.get(this._globalRoute('/users')),
  update: user => this._request.put(this._globalRoute('/users'), user),

  // other
  findCurrentUser: () => this._request.get(this._globalRoute('/users/current')), // getCurrentUser
  changeOrg: (userId, rootId) => this._request.put(this._globalRoute(`/users/changeOrg/${userId}`), { userId, rootId }),
};

export default Users = {
  create: user => this._request.post(this._localRoute('/users'), user), // insertUser
  find: () => this._request.get(this._localRoute('/users')), // list
  update: user => this._request.put(this._localRoute(`/users/${user._id}`), user),
  delete: userId => this._request.delete(this._localRoute(`/users/${userId}`)),

  // other
  findByGlobalId: globalId => this._request.get(this._localRoute(`/users?globalId=${globalId}`)),
  findDetails: userId => this._request.get(this._localRoute(`/users/${userId}/details`)), // getDetails
  checkDuplicateEmail: email => this._request.get(this._localRoute(`/users/checkDuplicateEmail/${email}`)),
};

export default Teams = {
  create: team => this._request.post(this._localRoute('/teams'), team), // insert
  find: () => this._request.get(this._localRoute('/teams')), // list
  update: team => this._request.put(this._localRoute(`/teams/${team._id}`), team),
  delete: teamId => this._request.delete(this._localRoute(`/teams/${teamId}`)),

  // other
  updateParentTeam: (teamId, parentTeamId) =>
    this._request.post(this._localRoute(`/teams/${teamId}/parent`), { parentId: parentTeamId }),
};

export default Roles = {
  create: role => this._request.post(this._localRoute('/roles'), role), // create
  find: () => this._request.get(this._localRoute('/roles')), // list
  update: role => this._request.put(this._localRoute(`/roles/${role._id}`), role),
  delete: roleId => this._request.delete(this._localRoute(`/roles/${roleId}`)),
  
  // other
  assignUser: (roleId, filledById) =>
    this._request.post(this._localRoute(`/roles/${roleId}/user`), { filledById }),
  unassignUser: roleId => this._request.delete(this._localRoute(`/roles/${roleId}/user`)),
  updateParentTeam: (roleId, teamId) =>
    this._request.post(this._localRoute(`/roles/${roleId}/parent`), { contributesToId: teamId }),
};

export default Goals = {
  create: goal => this._request.post(this._localRoute('/goals'), goal), // insert
  find: () => this._request.get(this._localRoute('/goals')), // list
  update: goal => this._request.put(this._localRoute(`/goals/${goal._id}`), goal),
  delete: goalId => this._request.delete(this._localRoute(`/goals/${goalId}`)),

  // other
  findByIds: goalIds => this._request.get(this._localRoute(`/goals?ids=${goalIds.join()}`)), // fetch
  updateOwners: (goalId, owners) => this._request.post(this._localRoute(`/goals/${goalId}/owners`), { owners }),
  updateTeams: (goalId, teams) => this._request.post(this._localRoute(`/goals/${goalId}/teams`), { teams }),
};

export default GoalLayouts = {
  findByObject: (objectIds, objectType) => this._request.get(this._localRoute(`/goal-layouts?objectType=${objectType}&objectIds=${objectIds.join()}`)), // get
  update: layout => this._request.put(this._localRoute(`/goal-layouts/${layout._id}`), layout),
};

export default Attachments = {
  create: attachment => this._request.post(this._localRoute('/attachments'), attachment), // addAttachment
  findByObject: object => this._request.get(this._localRoute(`/attachments?objectType=${object.objectType}&objectId=${object.objectId}`)), // fetchAttachments
  update: attachment => this._request.put(this._localRoute(`/attachments/${attachment._id}`), attachment), //updateAttachment
  delete: attachment => this._request.delete(this._localRoute(`/attachments/${attachment._id}`)), // deleteAttachment
};

export default Feed = {
  filter: params => this._request.get(this._localRoute(buildQuery('find', params))), // filterItems
};

export default TeamProfile = {
  findById: teamId => this._request.get(this._localRoute(`/team-profile/${teamId}`)), // get
  update: teamProfile => this._request.put(this._localRoute(`/team-profile/${teamProfile.teamId}`), teamProfile),
};

export default UserProfile = {
  findById: userId => this._request.get(this._localRoute(`/user-profile/${userId}`)), // get
  update: userProfile => this._request.put(this._localRoute(`/user-profile/${userProfile.userId}`), userProfile),
};

export default Interaction = {
  create: interaction => this._request.post(this._localRoute('/interactions'), interaction), // insert
  findByObject: (objectId, objectType) => this._request.get(this._localRoute(
    `/interactions?objectType=${objectType}&objectId=${objectId}`)), // listForObject
};

export default Notifications = {
  find: () => this._request.get(this._localRoute('/notifications')), // list

  // other
  getUnreadCount: () => this._request.get(this._localRoute('/notifications/unread-count')),
  markAsRead: () => this._request.post(this._localRoute('/notifications/markAsRead')),
  clear: () => this._request.post(this._localRoute('/notifications/clearAll')),
};

export default S3 = {
  getUploadURL: (fileName, fileType) =>
    this._request.get(this._localRoute(`/s3/getUploadUrl?fileName=${fileName}&fileType=${fileType}`)),
  uploadFile: (uploadUrl, file, fileType = file.type) =>
    Axios.put(uploadUrl, file, {
      headers: { 'Content-Type': fileType },
    }),
}

export default {
  GlobalUsers,
  Login,
  RootOrgs,
  Users,
  Teams,
  Roles,
  Goals,
  GoalLayouts,
  Attachments,
  Feed,
  TeamProfile,
  UserProfile,
  Interaction,
  Notifications,
  S3,
};
