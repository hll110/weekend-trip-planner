// pages/filter/filter.js
const app = getApp();

Page({
  data: {
    filters: {
      type: 'all',
      duration: 'all',
      highRating: true,
      includeFood: true,
      includeSchedule: true
    },
    filteredCount: 0,
    previewRoutes: []
  },

  onLoad: function() {
    this.setData({
      filters: { ...app.globalData.filters }
    });
    this.updatePreview();
  },

  setType: function(e) {
    const type = e.currentTarget.dataset.type;
    const filters = { ...this.data.filters, type };
    this.setData({ filters });
    this.updatePreview();
  },

  setDuration: function(e) {
    const duration = e.currentTarget.dataset.duration;
    const filters = { ...this.data.filters, duration };
    this.setData({ filters });
    this.updatePreview();
  },

  toggleHighRating: function(e) {
    const filters = { ...this.data.filters, highRating: e.detail.value };
    this.setData({ filters });
    this.updatePreview();
  },

  toggleIncludeFood: function(e) {
    const filters = { ...this.data.filters, includeFood: e.detail.value };
    this.setData({ filters });
    this.updatePreview();
  },

  toggleIncludeSchedule: function(e) {
    const filters = { ...this.data.filters, includeSchedule: e.detail.value };
    this.setData({ filters });
    this.updatePreview();
  },

  updatePreview: function() {
    const routes = app.globalData.routes || [];
    const { filters } = this.data;
    
    let filtered = routes;
    
    // 按类型筛选
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(route => route.type === filters.type);
    }
    
    // 按时长筛选
    if (filters.duration && filters.duration !== 'all') {
      filtered = filtered.filter(route => route.duration === filters.duration);
    }
    
    // 按评分筛选
    if (filters.highRating) {
      filtered = filtered.filter(route => route.rating >= 4.5);
    }
    
    // 获取预览路线（最多3条）
    const previewRoutes = filtered.slice(0, 3);
    
    this.setData({
      filteredCount: filtered.length,
      previewRoutes: previewRoutes
    });
  },

  resetFilters: function() {
    const defaultFilters = {
      type: 'all',
      duration: 'all',
      highRating: true,
      includeFood: true,
      includeSchedule: true
    };
    
    this.setData({ filters: defaultFilters });
    this.updatePreview();
  },

  applyFilters: function() {
    // 保存筛选条件到全局
    app.globalData.filters = { ...this.data.filters };
    
    // 返回上一页
    wx.navigateBack({
      delta: 1
    });
    
    // 显示应用成功提示
    wx.showToast({
      title: '筛选条件已应用',
      icon: 'success'
    });
  }
});