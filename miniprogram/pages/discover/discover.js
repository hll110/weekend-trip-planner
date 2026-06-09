const app = getApp();
const ext = require('../../data/extensions.js');
const weatherUtil = require('../../utils/weather.js');
const nav = require('../../utils/nav.js');
const tabBar = require('../../utils/tab-bar.js');

Page({
  data: {
    weather: null,
    dialect: null,
    festivals: ext.festivals,
    districts: ext.districts.filter(d => d.id !== 'all').slice(0, 12),
    districtTotal: ext.districts.length - 1
  },

  onLoad() {
    this.refreshWeather();
    this.pickDialect();
  },

  onShow() {
    tabBar.setTabSelected(this, 1);
    this.refreshWeather();
  },

  refreshWeather() {
    this.setData({ weather: weatherUtil.getChongqingWeather() });
  },

  pickDialect() {
    const list = ext.dialectPhrases;
    const dialect = list[Math.floor(Math.random() * list.length)];
    this.setData({ dialect });
  },

  goFood() {
    nav.open('/pages/food-guide/food-guide');
  },

  goCulture() {
    nav.open('/pages/culture/culture');
  },

  goMyRoutes() {
    nav.open('/pages/my-routes/my-routes');
  },

  applyAndHome(patch) {
    app.globalData.filters = { ...app.globalData.filters, ...patch };
    nav.toHome();
  },

  goFestivalRoutes(e) {
    this.applyAndHome({ festival: e.currentTarget.dataset.id });
  },

  filterByDistrict(e) {
    this.applyAndHome({ district: e.currentTarget.dataset.id });
  },

  filterBySeason(e) {
    this.applyAndHome({ season: e.currentTarget.dataset.id });
  },

  onShareAppMessage() {
    return {
      title: '渝趣周边游 - 发现山城',
      path: '/pages/discover/discover'
    };
  }
});
