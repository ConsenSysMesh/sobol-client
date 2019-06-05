const Client = require('../');
const Base = require('../base');

const { log, error } = console;
const key = '';
const endpoint = 'https://sobol.io/d/api/v1'; // for testing purposes

const handleError = (err) => {
  if (err.response && err.response.data) {
    error('Error:', err.response.data);
  } else {
    error('Error:', err.message);
  }
};

// basic usage
Client.configure({
  key,
  endpoint,
})
  .then(() => {
    const session = Client.getSession();
    const version = Client.getVersion();
    const {
      Users,
      Teams,
      Roles,
      Goals,
      Agreements,
    } = Client;

    log(`Version: ${version}`);
    log(`Org: ${session.oid}`);

    Users.find()
      .then((res) => {
        log('Users:', res.data.length);
      })
      .catch(handleError);

    Teams.find()
      .then((res) => {
        log('Teams:', res.data.length);
      })
      .catch(handleError);

    Roles.find()
      .then((res) => {
        log('Roles:', res.data.length);
      })
      .catch(handleError);

    Goals.find()
      .then((res) => {
        log('Goals:', res.data.length);
      })
      .catch(handleError);

    Agreements.find()
      .then((res) => {
        log('Agreements:', res.data.length);
      })
      .catch(handleError);
  })
  .catch((err) => {
    throw err;
  });

// extend the client
class MyClient extends Base {
  constructor() {
    super();
    log('MyClient Starting...');
  }
}

// create a new instance of the extended client (or base client)
const myClient = new MyClient();

myClient.configure({
  key,
})
  .then(() => {
    log('MyClient Started');
  })
  .catch((err) => {
    throw err;
  });
