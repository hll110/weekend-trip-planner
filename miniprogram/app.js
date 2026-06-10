const config = require('./config.js');
const localRoutes = require('./data/local-routes.js');
const userRoutes = require('./utils/user-routes.js');
const routeFilter = require('./utils/route-filter.js');
const extensions = require('./data/extensions.js');
const defaultFilters = require('./utils/default-filters.js');
const routeImages = require('./utils/route-images.js');

const DISTRICT_NAMES = {};
extensions.districts.forEach((d) => {
  DISTRICT_NAMES[d.id] = d.name;
});

App({
  globalData: {
    userInfo: null,
    userId: null,
    baseUrl: config.baseUrl,
    location: { ...config.defaultLocation },
    selectedLocation: null,
    routes: [],
    filters: { ...defaultFilters },
    routesReady: false
  },

  onLaunch: function() {
    this.getUserId();
    this.getLocation();
  },

  getUserId: function() {
    let userId = wx.getStorageSync('userId');
    if (!userId) {
      userId = this.generateUUID();
      wx.setStorageSync('userId', userId);
    }
    this.globalData.userId = userId;
  },

  generateUUID: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  getLocation: function() {
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.globalData.location.latitude = res.latitude;
        that.globalData.location.longitude = res.longitude;
        that.reverseGeocoder(res.latitude, res.longitude);
        that.loadRoutes();
      },
      fail: function() {
        console.log('位置获取失败，使用默认位置');
        that.loadRoutes();
      }
    });
  },

  reverseGeocoder: function(latitude, longitude) {
    const that = this;
    // 使用腾讯地图API或百度地图API进行逆地理编码
    // 这里使用模拟数据
    this.globalData.location.name = '当前位置';
    this.globalData.location.address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  },

  normalizeRoutes: function(routes) {
    return (routes || []).map((route) =>
      routeImages.enrichRoute(route, DISTRICT_NAMES[route.district] || '')
    );
  },

  notifyRoutesLoaded: function() {
    this.globalData.routesReady = true;
    this.routesLoadedCallback && this.routesLoadedCallback(this.globalData.routes);
  },

  getDefaultFilters: function() {
    return { ...defaultFilters };
  },

  loadRoutes: function() {
    if (!config.enableRemoteApi) {
      this.loadDefaultRoutes();
      this.notifyRoutesLoaded();
      return;
    }

    const that = this;
    const { latitude, longitude } = this.globalData.location;
    const { type, duration } = this.globalData.filters;

    wx.request({
      url: `${this.globalData.baseUrl}/routes`,
      method: 'GET',
      timeout: config.requestTimeout,
      data: {
        lat: latitude,
        lon: longitude,
        type: type,
        duration: duration,
        limit: config.requestLimit
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.routes) {
          that.globalData.routes = that.normalizeRoutes(res.data.routes);
        } else {
          that.loadDefaultRoutes();
        }
        that.notifyRoutesLoaded();
      },
      fail: () => {
        that.loadDefaultRoutes();
        that.notifyRoutesLoaded();
      }
    });
  },

  loadDefaultRoutes: function() {
    const merged = [...userRoutes.load(), ...localRoutes];
    this.globalData.routes = this.normalizeRoutes(merged);
  },

  reloadAllRoutes: function() {
    if (!config.enableRemoteApi) {
      this.loadDefaultRoutes();
      this.notifyRoutesLoaded();
      return;
    }
    this.loadRoutes();
  },

  // 获取路线详情
  getRouteById: function(routeId) {
    const id = Number(routeId);
    return this.globalData.routes.find(r => Number(r.id) === id);
  },

  fetchRouteById: function(routeId) {
    const that = this;
    const id = Number(routeId);
    const cached = this.getRouteById(id);
    if (cached) {
      return Promise.resolve(cached);
    }
    if (!config.enableRemoteApi) {
      return Promise.reject(new Error('local mode'));
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${that.globalData.baseUrl}/routes/${id}`,
        method: 'GET',
        timeout: config.requestTimeout,
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.id) {
            const route = that.normalizeRoutes([res.data])[0];
            const idx = that.globalData.routes.findIndex(r => Number(r.id) === id);
            if (idx >= 0) {
              that.globalData.routes[idx] = route;
            } else {
              that.globalData.routes.push(route);
            }
            resolve(route);
          } else {
            reject(res);
          }
        },
        fail: reject
      });
    });
  },

  getFilteredRoutes: function(filters) {
    return routeFilter.applyFilters(this.globalData.routes, filters);
  },

  // API请求封装
  request: function(options) {
    if (!config.enableRemoteApi) {
      return Promise.reject(new Error('remote api disabled'));
    }
    const that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${that.globalData.baseUrl}${options.url}`,
        method: options.method || 'GET',
        data: options.data || {},
        timeout: config.requestTimeout,
        header: { 'content-type': 'application/json' },
        success: (res) => (res.statusCode === 200 ? resolve(res.data) : reject(res)),
        fail: reject
      });
    });
  }
});