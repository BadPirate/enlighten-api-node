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
    limit = '',
    nextSend = '',
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

  api(path = '', params = {}, ignore = false) {
    let ts = Math.floor(Date.now()/1000);
    if (!ignore && this.nextSend && ts < this.nextSend) 
    {
      // Over rate limit, delay until next send and increment based on limit
      let p = new Promise(e => {
        setTimeout(_ => {
          e(this.api(path,params,true));
        },(this.nextSend-ts)*1000);
      });
      this.nextSend += Math.ceil(60 / this.limit);
      return p;
    }
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
              return;
            case 409:
              let message = JSON.parse(error.response.text);
              switch(message.period) {
                case "minute":
                  break;
                case "month":
                  reject(new Error('409 - Monthly rate limit hit for plan'));
                  return;
                default:
                  reject(error);
                  return;
              }
              this.limit = parseInt(message.limit);
              this.nextSend = message.period_end
              console.log(`Rate limit hit (${this.limit}m), applying and retrying`);
              this.api(path, params)
              .then(executor,reject);
              break;
            default:
              reject(error);
              return;
          }
        } else {
          executor(data);
        }
      })
    });
  }
}