const app = getApp();
const userRoutes = require('../../utils/user-routes.js');
const nav = require('../../utils/nav.js');

Page({
  data: { list: [] },

  onShow() {
    this.loadList();
  },

  loadList() {
    this.setData({ list: userRoutes.load() });
  },

  goAdd() {
    nav.open('/pages/my-route-edit/my-route-edit');
  },

  goDetail(e) {
    nav.toRouteDetail(e.currentTarget.dataset.id);
  },

  deleteRoute(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除路线',
      content: '确定删除这条分享路线吗？',
      success: (res) => {
        if (res.confirm) {
          userRoutes.remove(id);
          app.reloadAllRoutes();
          this.loadList();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  }
});
