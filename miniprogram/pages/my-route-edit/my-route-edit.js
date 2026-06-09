const app = getApp();
const userRoutes = require('../../utils/user-routes.js');
const { districts } = require('../../data/extensions.js');

Page({
  data: {
    form: {
      name: '',
      description: '',
      type: 'scenic',
      duration: '1day',
      district: 'yuzhong',
      spotName: '',
      highlights: '',
      food: '',
      distance: ''
    },
    districts: districts.filter(d => d.id !== 'all')
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  setType(e) {
    this.setData({ 'form.type': e.currentTarget.dataset.type });
  },

  setDuration(e) {
    this.setData({ 'form.duration': e.currentTarget.dataset.duration });
  },

  setDistrict(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      this.setData({ 'form.district': id });
      return;
    }
    const idx = Number(e.detail.value);
    const d = this.data.districts[idx];
    if (d) this.setData({ 'form.district': d.id });
  },

  pickLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'form.spotName': res.name,
          'form.lat': res.latitude,
          'form.lng': res.longitude
        });
      }
    });
  },

  submit() {
    const { form } = this.data;
    if (!form.name || !form.description) {
      wx.showToast({ title: '请填写名称和描述', icon: 'none' });
      return;
    }
    userRoutes.add(form);
    app.reloadAllRoutes();
    wx.showToast({ title: '分享成功', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 800);
  }
});
