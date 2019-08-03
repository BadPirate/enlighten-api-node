import EnlightenSystem from './EnlightenSystem';
import jsonp from 'jsonp-client'
const baseURL = 'https://api.enphaseenergy.com/api/v2/systems/';

/**
 * EnlightenAPI an API for connecting to a specific users Enlighten
 * @param {string=} userID The authenticated user token, default is test userID
 * @param {string=} appID if not set, defaults to env ENPHASE_APP_ID
 * @param {string=} apiKey if not set, defaults to env ENPHASE_API_KEY
 * @constructor
 */
export default class EnlightenAPI
{
  constructor(
    userID = '',
    appID = '',
    apiKey = '',
  ) 
  {
    this.userID = userID || '4d7a45774e6a41320a';
    this.appID = appID || process.env.ENPHASE_APP_ID;
    this.apiKey = apiKey || process.env.ENPHASE_API_KEY;
  }

  /**
   * Retrieves a list of servers, from cache if available for userID
   * 
   * @returns {Promise<Map<number,EnlightenSystem>>} A map of servers, indexed by system_id
   */
  getServers() {
    if (this.servers) return new Promise(e => { e(this.servers); });
    if (this.serversPromise) return this.serversPromise;
    this.serversPromise = this.api().then(res => {
      this.servers = new Map(res.systems.map(s => {
        return [s.system_id, new EnlightenSystem(this,s)];
      }));
      return this.servers; 
    });
    return this.serversPromise;
  }

  api(path = '', params = {}) {
    if (!this.apiKey) throw new Error("API key must be set in construction or ENPHASE_API_KEY env");
    let url = `${baseURL}${path}?key=${this.apiKey}&user_id=${this.userID}`;
    Object.keys(params).forEach(key => {
      let value = params[key];
      if (value) {
        url += `&${key}=${params[key]}`;
      }
    });
    return new Promise((executor, reject) => {
      jsonp(url, (error, data) => {
        if(error) {
          switch(error.status) {
            case 422:
              reject(new Error(`422 - ${error.response.text}`));
            default:
              reject(error);
          }
        } else {
          executor(data);
        }
      })
    });
  }
}