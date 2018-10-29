# Sobol Client

A JavaScript client library exposing Sobol's RESTful API.

## Install

```bash
npm install sobol-client
```

Then include in:

**Node**:

```javascript
const SobolClient = require('sobol-client');
```

**Browser**:
```html
<script src="./node_modules/sobol-client/dist/sobol-client.js">
```

## Connect

API access is granted with the use of [API Keys](docs/keys.md) as follows:

```javascript
SobolClient.connect({
  key: {
    private: 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUpR...',
    kid: '_SkDk2GrZ',
  },
})
  .then((client) => {
    console.log(client.getSession());
  })
  .catch((error) => {
    console.error(error);
  });
```
**Note**: To obtain keys, contact team@sobol.io.

## Query

To query the API, refer to the following list of endpoints and operations in [client.js](src/client.js).

E.g.:

```javascript
const { Users } = client;
const { user } = client.getSession();

Users.find()
  .then((res) => {
    const users = res.data;

    // check for automated users
    console.log(
      'Automated Users?',
      (users.includes(user)
        ? 'Yup! That\'s bad :('
        : 'Nope! Yay that\'s good!'
      )
    );
    
    // kill the session
    client.disconnect();
  });
```

## Extend

To extend this library, create a subclass as follows: 

```javascript
// client.js

const SobolClient = require('sobol-client/src/client');

class MyClient extends SobolClient {
  constructor() {
    super();

    this.Applications = {
      find: () => this._request.get(`${this._orgPath}/applications`),
    };
  }
}

module.exports = new Client(); // instantiates a singleton
```

Then use in:

```javascript
// index.js

const MyClient = require('./client.js');

MyClient.connect({
  key: {
    private: 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUpR...',
    kid: '_SkDk2GrZ',
  },
})
  .then((client) => {
    const { Applications } = client;

    return Applications.find()
      .then((res) => {
        console.log('Applications:', res.data);
      });
  });
```
**Note**: the browser distribution can not be extended directly.

## Development

**Install:**
- Clone repository
- Install dependencies with: `npm install`

**Run**: (include keys in `./tests/*.js`)
- Node: `npm run start-node`
- Browser: `npm run start-browser`

**Build**:
- Build browser distribution: `npm run build`
- Build and watch: `npm run watch`

**Publish**:

- Locally: `npm link`
- NPM: `npm publish`
