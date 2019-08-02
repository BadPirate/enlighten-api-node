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

## Example

Assuming you have your environmental variables set up, you first require the enphase library:

```javascript
import enphase from "enlighten-api";
```

Then query the Enphase Enlighten Systems API by instantiating a new `enphase.Request` object.
The simplest request is for a user's systems:

```javascript
new enphase.Request({
  api: 'systems',
  userId: user.id,
  success: function(data) {
    res.render('systemsResponse', data);
  },
  error: function(data) {
    res.render('error', data);
  }
});
```

The most elaborate will have a `systemId` and `query`:

```javascript
new enphase.Request({
  api: 'systems',
  userId: '4d7a45774e6a41320a',
  systemId: 67,
  query: { start_date: '2015-01-01' },
  success: function(data) {
    res.render('response', data);
  },
  error: function(data) {
    res.render('error', data);
  }
});
```

You can also access the enphase api vars directly from the enphase object:

```javascript
var enphaseAuthUrl = enphase.auth,
    enphaseApiKey = enphase.key;
```

## Original Author

[Jamie Ruderman](http://github.com/JamieRuderman) for Enphase.

### License

GNU General Public License
