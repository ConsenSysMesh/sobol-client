const TmntApi = require('../src/index');
const TmntClient = require('../src/client');

// KEYS
var key1 = {
  kid: '',
  private: '',
};

var key2 = {
  kid: '',
  private: '',
};

// USE CLIENT DIRECTLY
TmntApi.connect({
  key: key1,
  protocol: 'http',
  host: 'localhost',
})
  .then((client) => {
    const{ user } = client.getSession();
    const { Users } = client;
    Users.find()
      .then((res) => {
        const users = res.data;

        // check for automated users
        console.log(
          'Automated Users?',
          (users.includes(user) ?
            'Yup! That\'s bad :(' :
            'Nope! Yay that\'s good!'
          )
        );

        // kill the session
        client.disconnect();
      });
  })
  .catch(e => console.error(e));

// EXTEND AND USE THE CLIENT 
class MyClient extends TmntClient {
  constructor() {
    super();

    this.Applications = {
      find: () => this._request.get(`${this._orgPath}/applications`),
    };
  }
}

const Client = new MyClient();

Client.connect({
  key: key1,
  protocol: 'http',
  host: 'localhost',
})
  .then((client) => {
    const { Applications } = client;
    Applications.find()
      .then((res) => {
        console.log('Applications:', res.data);
        client.disconnect();
      });
  })
  .catch(e => console.error(e));

// TEST OTHER METHODS
TmntApi.connect({
  key: key1,
  protocol: 'http',
  host: 'localhost',
})
  .then((client) => {
    const clientJwt = client.getSession().jwt;

    return client.setKey(key2)
      .then(client2 => {
        console.log('Set New Keys:', client2._key.kid);

        // SET NEW TOKEN
        client2.setToken(clientJwt);
        console.log('Set New Token:', client2.getSession().jwt);

        // Set New Org
        client2.setOrg('NewOrg');
        console.log('Set New Org:', client2._orgId);
      });
  })
  .catch(e => console.error(e));
