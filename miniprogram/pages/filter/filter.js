const app = getApp();
const routeFilter = require('../../utils/route-filter.js');
const nav = require('../../utils/nav.js');
const tabBar = require('../../utils/tab-bar.js');
const { districts, seasons } = require('../../data/extensions.js');

Page({
  data: {
    filters: {},
    districts,
    seasons,
    filteredCount: 0,
    previewRoutes: []
  },

  onLoad() {
    this.refreshPreview(app.globalData.filters);
  },

  onShow() {
    tabBar.setTabSelected(this, 2);
    this.refreshPreview(app.globalData.filters);
  },

  refreshPreview(filters) {
    const f = { ...filters };
    const routes = app.globalData.routes || [];
    const filtered = routeFilter.applyFilters(routes, f);
    this.setData({
      filters: f,
      filteredCount: filtered.length,
      previewRoutes: filtered.slice(0, 3)
    });
  },

  patchFilter(key, value) {
    const filters = { ...this.data.filters, [key]: value };
    this.refreshPreview(filters);
  },

  setType(e) {
    this.patchFilter('type', e.currentTarget.dataset.type);
  },

  setDuration(e) {
    this.patchFilter('duration', e.currentTarget.dataset.duration);
  },

  setDistrict(e) {
    this.patchFilter('district', e.currentTarget.dataset.id);
  },

  setSeason(e) {
    this.patchFilter('season', e.currentTarget.dataset.id);
  },

  toggleHighRating(e) {
    this.patchFilter('highRating', e.detail.value);
  },

  resetFilters() {
    this.refreshPreview(app.getDefaultFilters());
  },

  applyFilters() {
    app.globalData.filters = { ...this.data.filters };
    nav.toHome();
    wx.showToast({ title: `已筛选 ${this.data.filteredCount} 条`, icon: 'none', duration: 1200 });
  }
});
