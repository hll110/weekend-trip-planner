// pages/location-picker/location-picker.js
const app = getApp();

Page({
  data: {
    currentLocation: {
      name: '正在获取位置...',
      address: ''
    },
    searchKey: '',
    searchResults: [],
    searchHistory: [],
    hotLocations: [
      { id: 1, name: '解放碑', address: '重庆市渝中区', icon: '🏛️', latitude: 29.556, longitude: 106.577 },
      { id: 2, name: '洪崖洞', address: '重庆市渝中区', icon: '🌃', latitude: 29.564, longitude: 106.579 },
      { id: 3, name: '磁器口古镇', address: '重庆市沙坪坝区', icon: '🏯', latitude: 29.580, longitude: 106.448 },
      { id: 4, name: '李子坝轻轨站', address: '重庆市渝中区', icon: '🚇', latitude: 29.553, longitude: 106.537 },
      { id: 5, name: '南山一棵树', address: '重庆市南岸区', icon: '🌲', latitude: 29.523, longitude: 106.607 },
      { id: 6, name: '武隆游客中心', address: '重庆市武隆区', icon: '⛰️', latitude: 29.325, longitude: 107.760 }
    ],
    isLoading: false
  },

  onLoad: function() {
    this.loadCurrentLocation();
    this.loadSearchHistory();
  },

  loadCurrentLocation: function() {
    const that = this;
    
    // 获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.reverseGeocoder(res.latitude, res.longitude);
      },
      fail: function() {
        that.setData({
          currentLocation: {
            name: '无法获取位置',
            address: '请检查位置权限'
          }
        });
      }
    });
  },

  reverseGeocoder: function(latitude, longitude) {
    const that = this;
    
    // 模拟逆地理编码
    // 实际项目中可以调用腾讯地图或百度地图API
    setTimeout(() => {
      that.setData({
        currentLocation: {
          name: '当前位置',
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          latitude: latitude,
          longitude: longitude
        }
      });
    }, 500);
  },

  refreshLocation: function() {
    wx.showLoading({ title: '获取位置中...' });
    this.loadCurrentLocation();
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },

  useCurrentLocation: function() {
    const location = this.data.currentLocation;
    
    // 保存到全局
    app.globalData.location = {
      ...app.globalData.location,
      name: location.name,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude
    };
    app.loadRoutes();

    wx.navigateBack({ delta: 1 });
    wx.showToast({ title: '已使用当前位置', icon: 'success' });
  },

  onSearch: function(e) {
    const searchKey = e.detail.value;
    this.setData({ searchKey });
    
    if (!searchKey) {
      this.setData({ searchResults: [] });
      return;
    }
    
    // 模拟搜索结果
    // 实际项目中可以调用地图搜索API
    this.searchLocations(searchKey);
  },

  searchLocations: function(keyword) {
    const that = this;
    this.setData({ isLoading: true });
    
    // 模拟搜索结果
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: `${keyword}（渝中区）`, address: '重庆市渝中区', distance: '1.2km', latitude: 29.556, longitude: 106.577 },
        { id: 2, name: `${keyword}（南岸区）`, address: '重庆市南岸区', distance: '2.5km', latitude: 29.523, longitude: 106.607 },
        { id: 3, name: `${keyword}（沙坪坝区）`, address: '重庆市沙坪坝区', distance: '3.8km', latitude: 29.580, longitude: 106.448 }
      ];
      
      that.setData({
        searchResults: mockResults,
        isLoading: false
      });
    }, 500);
  },

  clearSearch: function() {
    this.setData({
      searchKey: '',
      searchResults: []
    });
  },

  selectLocation: function(e) {
    const location = e.currentTarget.dataset.location;
    
    // 保存到搜索历史
    this.saveToHistory(location);
    
    // 保存到全局
    app.globalData.location = {
      ...app.globalData.location,
      name: location.name,
      address: location.address,
      latitude: location.latitude || 29.563,
      longitude: location.longitude || 106.551
    };
    app.loadRoutes();

    wx.navigateBack({ delta: 1 });
    wx.showToast({ title: '位置已选择', icon: 'success' });
  },

  selectHistory: function(e) {
    const location = e.currentTarget.dataset.location;
    this.selectLocation({ currentTarget: { dataset: { location } } });
  },

  deleteHistory: function(e) {
    const id = e.currentTarget.dataset.id;
    let searchHistory = this.data.searchHistory.filter(item => item.id !== id);
    
    this.setData({ searchHistory });
    wx.setStorageSync('searchHistory', searchHistory);
  },

  clearHistory: function() {
    wx.showModal({
      title: '清空历史',
      content: '确定要清空所有搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ searchHistory: [] });
          wx.removeStorageSync('searchHistory');
        }
      }
    });
  },

  saveToHistory: function(location) {
    let searchHistory = this.data.searchHistory;
    
    // 检查是否已存在
    const existingIndex = searchHistory.findIndex(item => item.id === location.id);
    if (existingIndex > -1) {
      searchHistory.splice(existingIndex, 1);
    }
    
    // 添加到开头
    searchHistory.unshift({
      id: location.id || Date.now(),
      name: location.name,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude
    });
    
    // 限制历史记录数量
    if (searchHistory.length > 10) {
      searchHistory = searchHistory.slice(0, 10);
    }
    
    this.setData({ searchHistory });
    wx.setStorageSync('searchHistory', searchHistory);
  },

  loadSearchHistory: function() {
    const searchHistory = wx.getStorageSync('searchHistory') || [];
    this.setData({ searchHistory });
  },

  chooseFromMap: function() {
    const that = this;
    
    wx.chooseLocation({
      success: function(res) {
        const location = {
          id: Date.now(),
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        };
        
        that.selectLocation({ currentTarget: { dataset: { location } } });
      },
      fail: function(err) {
        console.log('选择位置失败', err);
      }
    });
  }
});