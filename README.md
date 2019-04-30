# Sobol Client

A JavaScript client library exposing Sobol's RESTful API.

## Install

```bash
npm install sobol-client
```

Then include in:

**Node**:

```javascript
const Client = require('sobol-client');
```

**Browser**:
```html
<!-- include library -->
<script type="text/javascript" src="./node_modules/sobol-client/browser/sobol-client.js"></script>

<!-- instantiate the client -->
<script type="text/javascript">
  var Client = new SobolClient();

  // ...
</script>
```

## configure()

The configure function can be called at any time and allows you to pass options such as the `API Key` as follows:

```javascript
Client.configure({
  key: 'eyJhbGciOiJSUzI1NiIsI5cCI6IkpXVCJ9...',
})
  .then(function() {
    console.log('Session' + Client.getSession());
    console.log('Version' + Client.getVersion());

    // ...
  })
  .catch(function(error) {
    console.error(error);
  });
```
**Note**: to obtain a key, please email us at team@sobol.io.

### Options

| Option         | Type     | Description     | Default                     |
|----------------|----------|-----------------|-----------------------------|
| `key`          | String   | API Key         | `''`                        |
| `endpoint`     | String   | API Endpoint    | `https://sobol.io/d/api/v1` |
| `headers`      | Object   | Request Headers | `{}`                        |
| `orgId`        | String   | Organization ID | `''`                        |
| `errorHandler` | Function | Error Handler   | `Promise.reject(err)`       |

## Query

To query the API, refer to the following list of endpoints and operations in [base/index.js](base/index.js).  

Usage:

```javascript
Client.configure({
  key: 'eyJhbGciOiJSUzI1NiIsI5cCI6IkpXVCJ9...',
})
  .then(function() {
    Client.Users.find()
      .then(function(res) {
        console.log('Sobol has ' + res.data.length + ' users.');
      })
      .catch(function(error) {
        console.error('Network Error: ' + error.response.data);
      });
  })
```
**Note**: responses use the [Axios Response Schema](https://github.com/axios/axios#response-schema).

## Helper Functions

Use these functions to get information about the current instance as follows:

1. `getSession()` - returns the current session
2. `getKey()` - returns the current key
3. `getOrgId()` - returns the current organization Id
4. `getVersion()` - returns the current version

## Extending the Client

To extend the library, create a subclass as follows:

```javascript
// client.js

const BaseClient = require('sobol-client/base');

class MyClient extends BaseClient {
  constructor() {
    super();

    this.CustomEndpoints = {
      version: () => this._request.get('version'),
    };
  }
}

module.exports = new MyClient();
```

Then use in:

```javascript
// index.js

const MyClient = require('./client.js');

MyClient.configure({
  key: 'eyJhbGciOiJSUzI1NiIsI5cCI6IkpXVCJ9...',
})
  .then(() => {
    MyClient.CustomEndpoints.version()
      .then((res) => {
        console.log('Sobol Version: ', res.data);
      });
  });
```
**Note**: the browser distribution can not be extended.

## destroy()

The destroy function can be called once to dismantle the current instance as follows:

```javascript
Client.configure({
  key: 'eyJhbGciOiJSUzI1NiIsI5cCI6IkpXVCJ9...',
})
  .then(function() {
    Client.destroy();
  })
```

## Examples

To see a list of examples, please refer to the `examples` folder and run:

- Node: `npm run start-node`
- Browser: `npm run start-browser`

## Help and Feedback

For help and feedback, please send us an email to team@sobol.io and we will respond as soon as possible.
