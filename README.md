# NodeJS Enphase Enlighten Systems API

npm installable API for making calls to the Enlighten Enphase API

## Motivation

Quick and easy standarization of calls

## Installation

1. `npm install enlighten-api`
1. Set your Enphase API key and Application Id environment variables. You can find these by logging into your [Enphase developer account](https://developer.enphase.com/admin/applications) and selecting your application. The App id is the last part of the Authorization URL.
1. Quick set for the current session in a bash shell *(replace with your info)

### Command line

```bash
export ENPHASE_API_KEY='3aaa01a221a6603a71853fc1cc2c3a5b'
export ENPHASE_APP_ID='140961117xxxx'
```

### .env file

```bash
ENPHASE_API_KEY='3aaa01a221a6603a71853fc1cc2xxxx'
ENPHASE_APP_ID='140961117xxxx'
```

## Using

### Import
```javascript
import Enlighten from 'enlighten-api'
```

### Create API

Get a User ID using the authentication link and retrieval steps and then allocate an EnphaseAPI for use.

```javascript
const api = new EnphaseAPI(userID);
```

### Retrieve a system

Most calls (like stats) require you to specify a system.  This is done by first retrieving all systems, and using that object to make system calls.  Server list is cached, and will only go out once per alloc, so don't worry about making multiple calls.  Servers returns a Map of `[server => EnlightenServer]`

```javascript
api.getServers()
.then(servers => {
  return servers.get(28381);
}
.then(server => {
  return server.getStats(1564755300,1564775400);
})
.then(stats => {
  // Do something with those juicy Stats.
})
```

## Testing

1. Add your API key to .env `ENPHASE_API_KEY=` file
1. run `npm test`

## License

MIT