// pages/route-detail/route-detail.js
const app = getApp();
const navigation = require('../../../utils/navigation.js');
const { districts } = require('../../../data/extensions.js');

const districtMap = {};
districts.forEach(d => { districtMap[d.id] = d.name; });

Page({
  data: {
    route: null,
    routeId: null,
    culture: null,
    dialect: null,
    districtName: '',
    galleryIndex: 0
  },

  onLoad: function(options) {
    const routeId = parseInt(options.id);
    this.setData({ routeId });
    this.loadRouteDetail(routeId);
  },

  loadRouteDetail: function(routeId) {
    const that = this;
    
    // 确保路线数据已加载
    if (app.globalData.routes && app.globalData.routes.length > 0) {
      this.processRouteDetail(routeId);
    } else {
      // 等待数据加载
      wx.showLoading({ title: '加载中...' });
      
      // 设置数据加载回调
      app.routesLoadedCallback = (routes) => {
        that.processRouteDetail(routeId);
        wx.hideLoading();
      };
      
      // 超时处理
      setTimeout(() => {
        wx.hideLoading();
        if (app.globalData.routes && app.globalData.routes.length > 0) {
          that.processRouteDetail(routeId);
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }, 2000);
    }
  },

  processRouteDetail: function(routeId) {
    const that = this;
    const route = app.getRouteById(routeId);

    if (route) {
      that.setRouteData(route);
      return;
    }

    app.fetchRouteById(routeId)
      .then((detail) => that.setRouteData(detail))
      .catch(() => {
        wx.showToast({ title: '路线不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1500);
      });
  },

  setRouteData: function(route) {
    const culture = route.cultureId ? app.getCultureById(route.cultureId) : null;
    const dialect = app.getRandomDialect();
    this.setData({
      route,
      culture,
      dialect,
      districtName: route.districtName || districtMap[route.district] || '',
      galleryIndex: 0
    });
    wx.setNavigationBarTitle({ title: route.name });
  },

  onGalleryChange(e) {
    this.setData({ galleryIndex: e.detail.current });
  },

  onGalleryImageError(e) {
    const index = Number(e.currentTarget.dataset.index) || 0;
    const route = this.data.route;
    if (!route) return;
    const images = [...route.images];
    images[index] = '/images/placeholder.png';
    this.setData({
      route: { ...route, images, image: images[0] }
    });
  },

  navigateToSpot(e) {
    const index = e.currentTarget.dataset.index;
    const route = this.data.route;
    if (!route || !route.spots || !route.spots[index]) return;
    navigation.openSpot(route.spots[index], route.location);
  },

  startNavigation() {
    const route = this.data.route;
    if (!route) return;
    navigation.showSpotPicker(route);
  },

  goCulture() {
    if (!this.data.culture) return;
    wx.navigateTo({ url: '/pages/culture/culture' });
  },

  shareRoute: function() {
    const route = this.data.route;
    if (!route) return;
    
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage: function() {
    const route = this.data.route;
    if (!route) {
      return {
        title: '渝趣周边游',
        path: '/pages/index/index'
      };
    }
    
    return {
      title: `${route.name} - 周边游推荐`,
      path: `/packageRoutes/pages/route-detail/route-detail?id=${route.id}`,
      imageUrl: route.image || '/images/share-bg.png'
    };
  },

  onShareTimeline: function() {
    const route = this.data.route;
    if (!route) {
      return {
        title: '渝趣周边游 - 周末出行推荐'
      };
    }
    
    return {
      title: `${route.name} - 周边游推荐`,
      query: `id=${route.id}`,
      imageUrl: route.image || '/images/share-bg.png'
    };
  }
});