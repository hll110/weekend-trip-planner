// pages/index/index.js
const app = getApp();

Page({
  data: {
    location: {
      name: '正在获取位置...',
      address: ''
    },
    weather: null,
    routes: [],
    filteredRoutes: [],
    filters: {
      type: 'all',
      duration: 'all'
    },
    isLoading: true
  },

  onLoad: function() {
    this.setData({
      location: app.globalData.location,
      filters: app.globalData.filters
    });
    
    this.loadWeather();
    this.loadRoutes();
  },

  onShow: function() {
    // 每次显示页面时刷新数据
    if (app.globalData.routes && app.globalData.routes.length > 0) {
      this.filterRoutes();
    }
  },

  loadWeather: function() {
    const that = this;
    const { latitude, longitude } = app.globalData.location;
    
    // 模拟天气数据
    const mockWeather = {
      temp: 22,
      description: '晴朗',
      humidity: 45
    };
    
    this.setData({ weather: mockWeather });
    
    // 实际项目中可以调用天气API
    // app.request({ url: `/weather?lat=${latitude}&lon=${longitude}` })
    //   .then(res => that.setData({ weather: res.weather }));
  },

  loadRoutes: function() {
    const that = this;
    
    if (app.globalData.routes && app.globalData.routes.length > 0) {
      this.setData({
        routes: app.globalData.routes,
        isLoading: false
      });
      this.filterRoutes();
    } else {
      // 设置数据加载回调
      app.routesLoadedCallback = (routes) => {
        that.setData({
          routes: routes,
          isLoading: false
        });
        that.filterRoutes();
      };
      
      // 超时处理
      setTimeout(() => {
        if (that.data.isLoading) {
          that.setData({ isLoading: false });
          that.filterRoutes();
        }
      }, 2000);
    }
  },

  filterRoutes: function() {
    const { routes, filters } = this.data;
    
    let filtered = routes;
    
    // 按类型筛选
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(route => route.type === filters.type);
    }
    
    // 按时长筛选
    if (filters.duration && filters.duration !== 'all') {
      filtered = filtered.filter(route => route.duration === filters.duration);
    }
    
    this.setData({ filteredRoutes: filtered });
  },

  setTypeFilter: function(e) {
    const type = e.currentTarget.dataset.type;
    const filters = { ...this.data.filters, type };
    
    this.setData({ filters });
    app.globalData.filters = filters;
    this.filterRoutes();
  },

  setDurationFilter: function(e) {
    const duration = e.currentTarget.dataset.duration;
    const filters = { ...this.data.filters, duration };
    
    this.setData({ filters });
    app.globalData.filters = filters;
    this.filterRoutes();
  },

  resetFilters: function() {
    const filters = { type: 'all', duration: 'all' };
    this.setData({ filters });
    app.globalData.filters = filters;
    this.filterRoutes();
  },

  changeLocation: function() {
    wx.navigateTo({
      url: '/pages/location-picker/location-picker'
    });
  },

  goToRouteDetail: function(e) {
    const routeId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/route-detail/route-detail?id=${routeId}`
    });
  },

  randomRoute: function() {
    const { filteredRoutes } = this.data;
    if (filteredRoutes.length === 0) {
      wx.showToast({
        title: '暂无可用路线',
        icon: 'none'
      });
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredRoutes.length);
    const randomRoute = filteredRoutes[randomIndex];
    
    wx.navigateTo({
      url: `/pages/route-detail/route-detail?id=${randomRoute.id}`
    });
  },

  viewAllRoutes: function() {
    this.resetFilters();
  },

  openFilter: function() {
    wx.navigateTo({
      url: '/pages/filter/filter'
    });
  },

  onPullDownRefresh: function() {
    this.loadRoutes();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function() {
    // 可以在这里实现加载更多
  },

  onShareAppMessage: function() {
    return {
      title: '周边游助手 - 周末出行计划推荐',
      path: '/pages/index/index',
      imageUrl: '/images/share-bg.png'
    };
  }
});