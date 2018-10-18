import TmntApi from '../src/client';

var rsa = {
  private: '',
  kid: '',
};

var jwt = '';

TmntApi.connect({
  key: jwt,
  protocol: 'http',
  host: 'localhost',
  orgId: 'ConsenSys',
})
  .then((client) => {
    console.log(client.getSession());
    client.Users.find()
      .then(users => console.log(users.data));
  });
