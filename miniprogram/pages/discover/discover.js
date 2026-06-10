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
    hikingRoutes: [],
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
    const hikingRoutes = routes
      .filter((r) => r.type === 'hiking' && r.id >= 13)
      .slice(0, 6);
    this.setData({
      hikingRoutes,
      hikingCount: routes.filter((r) => r.type === 'hiking').length,
      scenicCount: routes.filter((r) => r.type === 'scenic').length,
      foodCount: routes.filter((r) => r.type === 'food').length
    });
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

  goAllHiking() {
    this.applyAndHome({ type: 'hiking' });
  },

  applyAndHome(patch) {
    app.globalData.filters = { ...app.globalData.filters, ...patch };
    nav.toHome();
  },

  onShareAppMessage() {
    return {
      title: '渝趣周边游 - 重庆小众徒步路线',
      path: '/pages/discover/discover'
    };
  }
});
