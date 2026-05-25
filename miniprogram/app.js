App({
  globalData: {
    userInfo: null,
    userId: null,
    baseUrl: 'http://localhost:9091/api',  // 后端API地址
    location: {
      latitude: 39.9042, // 默认北京
      longitude: 116.4074,
      name: '北京',
      address: ''
    },
    selectedLocation: null,
    routes: [],
    filters: {
      type: 'all', // all, food, hiking, scenic
      duration: 'all', // all, 1day, 2day
      foodPriority: false,
      hikingPriority: false,
      scenicPriority: false
    }
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

  loadRoutes: function() {
    const that = this;
    const { latitude, longitude } = this.globalData.location;
    
    // 尝试从后端获取路线数据
    wx.request({
      url: `${this.globalData.baseUrl}/routes`,
      method: 'GET',
      data: {
        lat: latitude,
        lon: longitude,
        type: this.globalData.filters.type,
        duration: this.globalData.filters.duration
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          that.globalData.routes = res.data.routes || [];
          that.routesLoadedCallback && that.routesLoadedCallback(that.globalData.routes);
        } else {
          that.loadDefaultRoutes();
        }
      },
      fail: () => {
        that.loadDefaultRoutes();
      }
    });
  },

  loadDefaultRoutes: function() {
    // 默认路线数据
    const defaultRoutes = [
      {
        id: 1,
        name: '北京经典一日游',
        type: 'scenic',
        duration: '1day',
        distance: '25公里',
        rating: 4.8,
        reviews: 128,
        description: '探索北京经典景点，感受古都文化',
        image: '/images/route1.jpg',
        highlights: ['故宫', '天安门广场', '景山公园'],
        food: ['北京烤鸭', '炸酱面', '豆汁儿'],
        spots: [
          { name: '故宫博物院', time: '2-3小时', ticket: '60元' },
          { name: '天安门广场', time: '1小时', ticket: '免费' },
          { name: '景山公园', time: '1小时', ticket: '2元' }
        ],
        foodSpots: [
          { name: '全聚德烤鸭店', type: '北京烤鸭', price: '人均150元' },
          { name: '老北京炸酱面馆', type: '炸酱面', price: '人均30元' }
        ],
        tags: ['文化', '历史', '经典']
      },
      {
        id: 2,
        name: '胡同美食探索之旅',
        type: 'food',
        duration: '1day',
        distance: '8公里',
        rating: 4.6,
        reviews: 89,
        description: '深入北京胡同，品尝地道小吃',
        image: '/images/route2.jpg',
        highlights: ['南锣鼓巷', '烟袋斜街', '什刹海'],
        food: ['卤煮火烧', '炒肝', '糖葫芦'],
        spots: [
          { name: '南锣鼓巷', time: '2小时', ticket: '免费' },
          { name: '烟袋斜街', time: '1小时', ticket: '免费' },
          { name: '什刹海', time: '2小时', ticket: '免费' }
        ],
        foodSpots: [
          { name: '姚记炒肝店', type: '炒肝', price: '人均20元' },
          { name: '卤煮火烧店', type: '卤煮火烧', price: '人均25元' }
        ],
        tags: ['美食', '胡同', '小吃']
      },
      {
        id: 3,
        name: '长城徒步一日游',
        type: 'hiking',
        duration: '1day',
        distance: '60公里',
        rating: 4.9,
        reviews: 256,
        description: '攀登长城，感受历史的厚重',
        image: '/images/route3.jpg',
        highlights: ['慕田峪长城', '箭扣长城'],
        food: ['农家菜', '山野菜'],
        spots: [
          { name: '慕田峪长城', time: '4-5小时', ticket: '40元' },
          { name: '箭扣长城', time: '3-4小时', ticket: '免费' }
        ],
        foodSpots: [
          { name: '长城脚下农家院', type: '农家菜', price: '人均60元' }
        ],
        tags: ['徒步', '长城', '户外']
      },
      {
        id: 4,
        name: '京郊两日休闲游',
        type: 'scenic',
        duration: '2day',
        distance: '120公里',
        rating: 4.7,
        reviews: 67,
        description: '逃离城市喧嚣，享受京郊宁静',
        image: '/images/route4.jpg',
        highlights: ['古北水镇', '司马台长城', '密云水库'],
        food: ['水库鱼', '农家菜', '豆腐宴'],
        spots: [
          { name: '古北水镇', time: '4-5小时', ticket: '140元' },
          { name: '司马台长城', time: '2-3小时', ticket: '40元' },
          { name: '密云水库', time: '2小时', ticket: '免费' }
        ],
        foodSpots: [
          { name: '古北水镇餐厅', type: '特色菜', price: '人均80元' },
          { name: '水库鱼馆', type: '水库鱼', price: '人均100元' }
        ],
        tags: ['两日游', '休闲', '京郊']
      },
      {
        id: 5,
        name: '奥林匹克公园徒步',
        type: 'hiking',
        duration: '1day',
        distance: '15公里',
        rating: 4.5,
        reviews: 45,
        description: '现代建筑与自然景观的完美结合',
        image: '/images/route5.jpg',
        highlights: ['鸟巢', '水立方', '奥林匹克森林公园'],
        food: ['园区餐厅', '快餐'],
        spots: [
          { name: '鸟巢', time: '1-2小时', ticket: '50元' },
          { name: '水立方', time: '1小时', ticket: '30元' },
          { name: '奥林匹克森林公园', time: '2-3小时', ticket: '免费' }
        ],
        foodSpots: [
          { name: '鸟巢餐厅', type: '快餐', price: '人均40元' }
        ],
        tags: ['现代', '公园', '休闲']
      }
    ];
    
    this.globalData.routes = defaultRoutes;
    this.routesLoadedCallback && this.routesLoadedCallback(defaultRoutes);
  },

  // 获取路线详情
  getRouteById: function(routeId) {
    return this.globalData.routes.find(r => r.id === routeId);
  },

  // 根据筛选条件获取路线
  getFilteredRoutes: function(filters) {
    let routes = this.globalData.routes;
    
    if (filters.type && filters.type !== 'all') {
      routes = routes.filter(r => r.type === filters.type);
    }
    
    if (filters.duration && filters.duration !== 'all') {
      routes = routes.filter(r => r.duration === filters.duration);
    }
    
    return routes;
  },

  // API请求封装
  request: function(options) {
    const that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${that.globalData.baseUrl}${options.url}`,
        method: options.method || 'GET',
        data: options.data || {},
        header: { 'content-type': 'application/json' },
        success: (res) => res.statusCode === 200 ? resolve(res.data) : reject(res),
        fail: reject
      });
    });
  }
});