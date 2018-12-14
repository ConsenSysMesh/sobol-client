# API Keys

To access Sobol's API layer, you must be issued `API Keys`.
Use these keys **manually** or with the **client**.

**Note**: To obtain keys, contact team@sobol.io.

## RSA Key Pairs

Sobol uses [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) key signing to authenticate with the API. These keys are as follows:

```json
{
  "kid": "_4kDg2GrZ",
  "kty": "rsa",
  "kft": "base64",
  "key": {
    "public": "LS0tLS1CRUdJTiBddfdfdcv3DDSQVUJM5gS0VZLS0tL...",
    "private": "LS0tLS1CRiBddfUdJTdiFWidBddfS0tLS0tCk1JSUp..."
  },
  "alg": {
    "public": "spki",
    "private": "pkcs8"
  }
}
```
**Note**: The RSA key pairs are encoded in `base64` and will have to be decoded when used with most RSA signing [libraries](#libraries).

## Authorization

The client performs the following steps to authenticate:

- Decodes the supplied `private` key from `base64` to `ascii`
- Creates a `base64` encoded `SHA256 signature` with the following:
  - `message` - `kid` plus the current `unix timestamp`
  - `private` key
- `POST`s the following `body` to https://sobol.io/d/api/v1/login/ :

```json
{
  "type": "rsa",
  "authorization": {
    "signature": "OiJSUzI1NiIDfFdEadfdfsInR5cCI...",
    "kid": "_4kDg2GrZ",
    "timestamp": "1541735825169"
  }
}
```

- Includes the returned [JWT](https://jwt.io/) in every subsequent request as follows:

```json
{
  "Authorization": "Bearer eyJhbGciOiJSUzI1NiIDfFdEadfdInR9..."
}
```

- Decodes session information from the JWT resulting in:

```json
{
  "type": "",
  "user": {},
  "orgIds": []
}
```

## Libraries

* [JWT](https://jwt.io/)
* [OpenSSL](https://www.openssl.org/)
* [cypto](https://nodejs.org/api/crypto.html)
* [Python RSA](https://pypi.org/project/rsa/)
* [Java Example](https://gist.github.com/nielsutrecht/855f3bef0cf559d8d23e94e2aecd4ede)
