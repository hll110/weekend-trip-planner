const app = getApp();
const weatherUtil = require('../../utils/weather.js');
const routeFilter = require('../../utils/route-filter.js');
const nav = require('../../utils/nav.js');
const tabBar = require('../../utils/tab-bar.js');
const { districts } = require('../../data/extensions.js');

Page({
  data: {
    location: { name: '正在获取位置...', address: '' },
    weather: null,
    routes: [],
    filteredRoutes: [],
    activeFilterLabels: [],
    filters: app.getDefaultFilters(),
    isLoading: true
  },

  onLoad() {
    this.syncPageState();
    this.loadWeather();
    this.bindRoutesCallback();
  },

  onShow() {
    tabBar.setTabSelected(this, 0);
    this.syncPageState();
  },

  syncPageState() {
    const filters = { ...app.globalData.filters };
    const routes = app.globalData.routes || [];
    const filteredRoutes = routeFilter.applyFilters(routes, filters);
    this.setData({
      location: app.globalData.location,
      filters,
      routes,
      filteredRoutes,
      activeFilterLabels: this.buildFilterLabels(filters),
      isLoading: !app.globalData.routesReady && routes.length === 0
    });
  },

  buildFilterLabels(filters) {
    const labels = [];
    const typeMap = { food: '美食路线', hiking: '徒步爬山', scenic: '景区游玩' };
    const seasonMap = { spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季' };
    if (filters.type && filters.type !== 'all') labels.push(typeMap[filters.type] || filters.type);
    if (filters.duration && filters.duration !== 'all') {
      labels.push(filters.duration === '1day' ? '1日游' : '2日游');
    }
    if (filters.district && filters.district !== 'all') {
      const d = districts.find((x) => x.id === filters.district);
      if (d) labels.push(d.name);
    }
    if (filters.season && filters.season !== 'all') labels.push(seasonMap[filters.season]);
    if (filters.highRating) labels.push('高分路线');
    return labels;
  },

  bindRoutesCallback() {
    app.routesLoadedCallback = () => this.syncPageState();
    if (!app.globalData.routesReady) {
      setTimeout(() => {
        if (this.data.isLoading) this.syncPageState();
      }, 1500);
    }
  },

  preventTap() {},

  onImageError(e) {
    const id = Number(e.currentTarget.dataset.id);
    const imgIndex = Number(e.currentTarget.dataset.index) || 0;
    const placeholder = '/images/placeholder.png';
    const routes = this.data.routes.map((r) => {
      if (Number(r.id) !== id) return r;
      const images = [...(r.images || [r.image])];
      images[imgIndex] = placeholder;
      return { ...r, images, image: images[0], imageCount: images.length };
    });
    app.globalData.routes = routes;
    const filteredRoutes = routeFilter.applyFilters(routes, this.data.filters);
    this.setData({ routes, filteredRoutes });
  },

  loadWeather() {
    this.setData({ weather: weatherUtil.getChongqingWeather() });
  },

  applyFilter(key, value) {
    const filters = { ...app.globalData.filters, [key]: value };
    app.globalData.filters = filters;
    this.syncPageState();
  },

  setTypeFilter(e) {
    this.applyFilter('type', e.currentTarget.dataset.type);
  },

  resetFilters() {
    app.globalData.filters = app.getDefaultFilters();
    this.syncPageState();
  },

  changeLocation() {
    nav.open('/pages/location-picker/location-picker');
  },

  goToRouteDetail(e) {
    nav.toRouteDetail(e.currentTarget.dataset.id);
  },

  openFilter() {
    nav.toFilter();
  },

  onPullDownRefresh() {
    app.reloadAllRoutes();
    this.loadWeather();
    this.bindRoutesCallback();
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: '渝趣周边游 - 重庆小众徒步路线',
      path: '/pages/index/index',
      imageUrl: '/images/share-bg.png'
    };
  }
});
