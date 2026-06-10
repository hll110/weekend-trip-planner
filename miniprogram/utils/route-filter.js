const { getCurrentSeason } = require('./weather.js');

function applyFilters(routes, filters) {
  let list = routes || [];
  const f = filters || {};

  if (f.audience && f.audience !== 'all') {
    list = list.filter(r => r.audience === f.audience);
  }
  if (f.type && f.type !== 'all') {
    list = list.filter(r => r.type === f.type);
  }
  if (f.duration && f.duration !== 'all') {
    list = list.filter(r => r.duration === f.duration);
  }
  if (f.district && f.district !== 'all') {
    list = list.filter(r => r.district === f.district);
  }
  if (f.season && f.season !== 'all') {
    list = list.filter(r => !r.seasons || r.seasons.includes(f.season));
  }
  if (f.highRating) {
    list = list.filter(r => r.rating >= 4.5);
  }
  return list;
}

function getSuggestedSeason() {
  return getCurrentSeason();
}

module.exports = {
  applyFilters,
  getSuggestedSeason
};
