const Client = require('../');
const Base = require('../base');

const RsaClient = new Base();
const { log, error } = console;
const apiKey = '';
const rsa = {
  kid: '...',
  private: '...',
};

// rsa usage
RsaClient.connect({
  key: rsa,
  protocol: 'http',
  host: 'localhost',
})
  .catch((err) => {
    error('Client Error', err.message);
  });

// basic usage
Client.connect({
  key: apiKey,
  protocol: 'http',
  host: 'localhost',
})
  .then(() => {
    log('Version:', Client.getVersion());

    return Client.setKey(apiKey)
      .then((updatedClient) => {
        log('Set New Keys:', updatedClient.getKey());

        updatedClient.setToken(apiKey);
        log('Set New Token:', updatedClient.getSession());

        updatedClient.setOrg('NewOrg');
        log('Set New Org:', updatedClient.getOrgId());
      });
  })
  .catch(e => error(e));
