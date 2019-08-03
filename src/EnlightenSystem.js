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
   * @returns {Promise<Array<EnlightenStat>>} returns a promise for an array of stats objects
   */
  getStats(startAt = '', endAt = '') 
  {
    console.log("stats",startAt || '-', endAt || '-')
    if (startAt) startAt = Math.floor(parseInt(startAt) / 300) * 300;
    if (endAt) endAt = Math.floor(parseInt(endAt) / 300) * 300;
    if (endAt && (!startAt || endAt < startAt)) endAt = '';
    let at = startAt;
    if(startAt) {
      // Some of the records are available in cache
      if (this.cachedStats.get(startAt)) 
      {
        let intervals = [];
        if (!endAt) endAt = startAt + 30000;
        while(this.cachedStats.get(at) && at <= endAt)
        {
          intervals.push(this.cachedStats.get(at));
          at += 300;
        }
        if (at > endAt-300) 
        {
          // We had all the needed records in cache
          return new Promise(e => { e(intervals) });
        }
        // Fetch the remainder using API, append and return
        console.log(`Retrieved cached ${startAt} - ${at}, fetching to ${endAt} with API`);
        return this.getStats(at,endAt)
        .then(stats => {
          return intervals.concat(stats);
        });
      }
    }

    // No cache - Retrieve records from API
    return this.api('stats', {
      start_at: startAt,
      end_at: endAt,
    })
    .then(stats => {
      let last = '';
      let intervals = [];
      stats.intervals.forEach(statProps => {
        let stat = new EnlightenStat(statProps);
        this.cachedStats.set(stat.startAt,stat);
        intervals.push(stat);
        last = stat.endAt;
      });
      if (last && last < endAt) {
        // Fetch more records, use cached to fill in
        console.log(`API returned less records than desired ${last}, retrieving remainder`);
        return this.getStats(startAt, endAt);
      }
      return intervals;
    });
  }

  /**
   * Convienience method for retrieving the amount of electricity generated
   * during a specific period.
   * @param {number} startAt unix timestamp, will be rounded down to nearest 5 min
   * @param {number} endAt unix timestamp, will be rounded down to the nearest 5 min
   * @returns {number} returns total WH (Watt Hours) generated during period in question
   */
  getEnergyProduced(startAt, endAt) {
    return this.getStats(startAt, endAt)
      .then(stats => {
        let total = 0;
        stats.forEach(stat => {
          total += stat.produced;
        });
        return total;
      });
  }

  api(path, params) {
    return this.enphaseAPI.api(`${this.system_id}/${path}`,params);
  }
}

/**
 * Internal carrier for stats call result data, do not directly alloc
 * instead use EnlightenSystem.getStats() or related
 */
class EnlightenStat {
  constructor(props) {
    this.endAt = parseInt(props.end_at);
    this.startAt = this.endAt - 300;
    this.averagePower = parseInt(props.powr);
    this.produced = parseInt(props.enwh);
    this.devicesReporting = parseInt(props.devices_reporting);
  }
}