const app = getApp();
const ext = require('../../data/extensions.js');
const weatherUtil = require('../../utils/weather.js');
const nav = require('../../utils/nav.js');
const tabBar = require('../../utils/tab-bar.js');

Page({
  data: {
    weather: null,
    districts: ext.districts.filter((d) => d.id !== 'all').slice(0, 16),
    districtTotal: ext.districts.length - 1,
    seasons: ext.seasons.filter((s) => s.id !== 'all'),
    popularRoutes: [],
    nicheRoutes: [],
    popularCount: 0,
    nicheCount: 0,
    hikingCount: 0,
    scenicCount: 0,
    foodCount: 0
  },

  onLoad() {
    this.refreshWeather();
    this.loadRouteStats();
  },

  onShow() {
    tabBar.setTabSelected(this, 1);
    this.refreshWeather();
    this.loadRouteStats();
  },

  refreshWeather() {
    this.setData({ weather: weatherUtil.getChongqingWeather() });
  },

  loadRouteStats() {
    const routes = app.globalData.routes || [];
    const popularRoutes = routes.filter((r) => r.audience === 'popular').slice(0, 4);
    const nicheRoutes = routes.filter((r) => r.audience === 'niche').slice(0, 6);
    this.setData({
      popularRoutes,
      nicheRoutes,
      popularCount: routes.filter((r) => r.audience === 'popular').length,
      nicheCount: routes.filter((r) => r.audience === 'niche').length,
      hikingCount: routes.filter((r) => r.type === 'hiking').length,
      scenicCount: routes.filter((r) => r.type === 'scenic').length,
      foodCount: routes.filter((r) => r.type === 'food').length
    });
  },

  filterByAudience(e) {
    this.applyAndHome({ audience: e.currentTarget.dataset.audience, type: 'all' });
  },

  filterByType(e) {
    this.applyAndHome({ type: e.currentTarget.dataset.type });
  },

  filterByDistrict(e) {
    this.applyAndHome({ district: e.currentTarget.dataset.id });
  },

  filterBySeason(e) {
    this.applyAndHome({ season: e.currentTarget.dataset.id });
  },

  goToRoute(e) {
    nav.toRouteDetail(e.currentTarget.dataset.id);
  },

  goAllPopular() {
    this.applyAndHome({ audience: 'popular', type: 'all' });
  },

  goAllNiche() {
    this.applyAndHome({ audience: 'niche', type: 'all' });
  },

  applyAndHome(patch) {
    app.globalData.filters = { ...app.globalData.filters, ...patch };
    nav.toHome();
  },

  onShareAppMessage() {
    return {
      title: '渝趣周边游 - 大众景点与小众秘境',
      path: '/pages/discover/discover'
    };
  }
});
