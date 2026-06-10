const app = getApp();
const navigation = require('../../utils/navigation.js');
const { districts } = require('../../../data/extensions.js');

const districtMap = {};
districts.forEach((d) => { districtMap[d.id] = d.name; });

Page({
  data: {
    route: null,
    routeId: null,
    districtName: '',
    galleryIndex: 0
  },

  onLoad(options) {
    const routeId = parseInt(options.id);
    this.setData({ routeId });
    this.loadRouteDetail(routeId);
  },

  loadRouteDetail(routeId) {
    const that = this;

    if (app.globalData.routes && app.globalData.routes.length > 0) {
      this.processRouteDetail(routeId);
    } else {
      wx.showLoading({ title: '加载中...' });

      app.routesLoadedCallback = () => {
        that.processRouteDetail(routeId);
        wx.hideLoading();
      };

      setTimeout(() => {
        wx.hideLoading();
        if (app.globalData.routes && app.globalData.routes.length > 0) {
          that.processRouteDetail(routeId);
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
          setTimeout(() => wx.navigateBack(), 1500);
        }
      }, 2000);
    }
  },

  processRouteDetail(routeId) {
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

  setRouteData(route) {
    this.setData({
      route,
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

  shareRoute() {
    const route = this.data.route;
    if (!route) return;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  onShareAppMessage() {
    const route = this.data.route;
    if (!route) {
      return { title: '渝趣周边游', path: '/pages/index/index' };
    }
    return {
      title: `${route.name} - 重庆周边游`,
      path: `/packageRoutes/pages/route-detail/route-detail?id=${route.id}`,
      imageUrl: route.image || '/images/share-bg.png'
    };
  },

  onShareTimeline() {
    const route = this.data.route;
    if (!route) {
      return { title: '渝趣周边游 - 小众徒步路线' };
    }
    return {
      title: `${route.name} - 重庆周边游`,
      query: `id=${route.id}`,
      imageUrl: route.image || '/images/share-bg.png'
    };
  }
});
