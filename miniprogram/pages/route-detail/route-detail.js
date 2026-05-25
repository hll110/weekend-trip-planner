// pages/route-detail/route-detail.js
const app = getApp();

Page({
  data: {
    route: null,
    routeId: null
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
    const route = app.getRouteById(routeId);
    
    if (!route) {
      wx.showToast({
        title: '路线不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }
    
    this.setData({ route });
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: route.name
    });
  },

  startNavigation: function() {
    const route = this.data.route;
    if (!route || !route.spots || route.spots.length === 0) {
      wx.showToast({
        title: '暂无导航信息',
        icon: 'none'
      });
      return;
    }
    
    // 这里可以集成地图导航功能
    // 示例：打开微信内置地图
    const firstSpot = route.spots[0];
    
    wx.showModal({
      title: '开始导航',
      content: `即将导航到${firstSpot.name}，是否继续？`,
      success: (res) => {
        if (res.confirm) {
          // 实际项目中可以调用微信地图API
          wx.showToast({
            title: '导航功能开发中',
            icon: 'none'
          });
        }
      }
    });
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
        title: '周边游助手',
        path: '/pages/index/index'
      };
    }
    
    return {
      title: `${route.name} - 周边游推荐`,
      path: `/pages/route-detail/route-detail?id=${route.id}`,
      imageUrl: route.image || '/images/share-bg.png'
    };
  },

  onShareTimeline: function() {
    const route = this.data.route;
    if (!route) {
      return {
        title: '周边游助手 - 周末出行计划推荐'
      };
    }
    
    return {
      title: `${route.name} - 周边游推荐`,
      query: `id=${route.id}`,
      imageUrl: route.image || '/images/share-bg.png'
    };
  }
});