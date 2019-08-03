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

## Testing

1. Add your API key to .env `ENPHASE_API_KEY=` file
1. run `npm test`

## License

MIT