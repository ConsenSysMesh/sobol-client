const Client = require('../');
const Base = require('../base');

const { log, error } = console;
const key = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXV0b21hdGVkIiwia2lkIjoiWWtTYVJOclExeiIsIm9pZCI6IkNvbnNlblN5cyIsInVpZCI6IkNSRml5LW9nT1giLCJpYXQiOjE1NTY1MDExNzEsImV4cCI6MTU4ODAzNzE3MX0.aJnBid8Hwa4SSDQTwI5WiR3vX-m405LGw3gtrKFMNR16yJ2mvuGeeLL_t5E_DhkQGikBnLlTxhXTRPH6Go6furSQ0e8gPmKOcQiEO7KyYPbzHj9gvqVCsljreDfZd2JQgB8gQ2ZVYNySyLpL-crqwSTWsI_3ldnjSTAzkSg221NNcR3_Fa2WF_JO4FPh8CsN-ZvBc95ZvUmfxDnceV89sswa8JCq16AY_N1-IutbRGeiP6cKFkw3rWafDgySsfJU90K3rh4vQQOrXFFxdgmHBzg8-R3KEUEmlK8bDeTLdJDV3NHRSRTCwmC6fFx57-MGwYu7nnjjKChB7gobJbac41igt0xQWPGo3kq14NUKggxYViOZNBE8RZB67_eVU25VSehZSadw1mYuSERsLtYcCdVaMlMvptHtqrjmdEzim2aHHuGn2j_eoNB_cOnsc6XVYzAiIX8BbPcuh-_Vs5SzQ8MvJ__h9B2D4XdJW9TtuMKrQK9lFHirrB355jQU3LHSKIIZlJhNo-igw9xdsK8gI25P0y17xf52OGr9SY_TSq4Yv02kl92yrwaJnPyVwZvrU0ylgr23i43oPpQCFpWyeJxXOCYA0PTJH-2RDEfke3xhAL0B5GXQ4DI-wrTHF6-DRJT7j_heKmrB50tzlj0dBLlzAAiG2f0E51y3o92qQEw';

const handleError = (err) => {
  error('Error:', err.response.data);
};

// basic usage
Client.configure({
  key,
  endpoint: 'http://localhost/api/v1',
})
  .then(() => {
    const session = Client.getSession();
    const version = Client.getVersion();
    const {
      Applications,
      Users,
      Teams,
      Roles,
      Goals,
      Agreements,
    } = Client;

    log(`Version: ${version}`);
    log(`Org: ${session.oid}`);

    Applications.find()
      .then((res) => {
        log('Applications:', res.data.length);
      })
      .catch(handleError);

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
  endpoint: 'http://localhost/api/v1',
})
  .then(() => {
    log('MyClient Started');
  })
  .catch((err) => {
    throw err;
  });
