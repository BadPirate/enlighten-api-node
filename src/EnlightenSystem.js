/**
 * A wrapper for a particular system belonging to a user
 * Should not be constructed manually, retrieve using EnlightenAPI.getServers()
 */
export default class EnlightenSystem {
  constructor(parent, props) {
    for (var fld in props) {
      this[fld] = props[fld];
    }
    this.enphaseAPI = parent;
    this.cachedStats = new Map();
  }

  /**
   * Retrieves stats for power production for every 5 minute period.  Will return cached values if they exist,
   * and retrieve any missing values from the server making multiple calls if needed.
   * 
   * @param {number=''} startAt unix timestamp for first stat wanted, will round down to nearest 5 min block
   * @param {number=''} endAt unix timestamp for last stat wanted, will round down to nearest 5 min block
   * @returns {Promise<Array<Any>>} returns a promise for an array of stats objects
   */
  getStats(startAt = '', endAt = '') 
  {
    if (startAt) startAt = Math.floor(parseInt(startAt) / 300) * 300;
    if (endAt) endAt = Math.floor(parseInt(endAt) / 300) * 300;
    if (endAt && (!startAt || endAt < startAt)) endAt = '';
    let at = startAt;
    if(startAt) {
      if (this.cachedStats.get(startAt)) 
      {
        let intervals = [];
        if (!endAt) endAt = startAt + 30000;
        while(this.cachedStats.get(at) && at < endAt)
        {
          intervals.push(this.cachedStats.get(at));
          at += 300;
        }
        if (at >= endAt) 
        {
          return new Promise(e => { e({
            system_id: this.system_id,
            total_devices: this.total_devices,
            intervals: intervals,
          })});
        }
        return this.getStats(at,endAt).then(stats => {
          return intervals.concat(stats.intervals);
        });
      }
    }
    return this.api('stats', {
      start_at: startAt,
      end_at: endAt,
    })
    .then(stats => {
      stats.intervals.forEach(interval => {
        this.cachedStats.set(interval.end_at-300,interval);
      });
      return stats;
    });
  }

  api(path, params) {
    return this.enphaseAPI.api(`${this.system_id}/${path}`,params);
  }
}
