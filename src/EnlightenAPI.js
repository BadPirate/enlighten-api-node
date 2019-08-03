import jsonp from 'jsonp-client';
const baseURL = 'https://api.enphaseenergy.com/api/v2/systems/';

export default class EnlightenAPI
{
  constructor(
    userID = '',
    appID = '',
    apiKey = ''
  ) 
  {
    this.userID = userID || '4d7a45774e6a41320a';
    this.appID = appID || process.env.ENPHASE_APP_ID;
    this.apiKey = apiKey || process.env.ENPHASE_API_KEY;
    this.servers = '';
  }

  getServers() {
    if (this.servers) return new Promise(e => { e(this.servers); });
    return this.api().then(res => {
      this.servers = new Map(res.systems.map(s => {
        return [s.system_id, new EnphaseServer(this,s)];
      }));
      return this.servers; 
    });
  }

  api() {
    if (!this.apiKey) throw new Error("API key must be set in construction or ENPHASE_API_KEY env");
    let url = `${baseURL}?key=${this.apiKey}&user_id=${this.userID}`;
    return new Promise((executor, reject) => {
      jsonp(url, (error, data) => {
        if(error) {
          reject(error);
        } else {
          executor(data);
        }
      })
    });
  }
}

export class EnphaseServer
{
  constructor(parent, props) {
    for (var fld in props) {
      this[fld] = props[fld];
    }
    var api = parent;
  }
}