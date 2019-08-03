export default class EnlightenServer {
  constructor(parent, props) {
    for (var fld in props) {
      this[fld] = props[fld];
    }
    this.enphaseAPI = parent;
  }

  getStats(startAt = '', endAt = '') 
  {
    return this.api('stats', {
      start_at: startAt,
      end_at: endAt,
    });
  }

  api(path, params) {
    return this.enphaseAPI.api(`${this.system_id}/${path}`,params);
  }
}
