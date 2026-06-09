const { foodsExtended } = require('../../data/extensions.js');

Page({
  data: {
    foods: foodsExtended,
    keyword: ''
  },

  onSearch(e) {
    const keyword = (e.detail.value || '').trim().toLowerCase();
    const foods = foodsExtended.filter(f =>
      !keyword ||
      f.name.toLowerCase().includes(keyword) ||
      f.type.includes(keyword) ||
      f.district.includes(keyword)
    );
    this.setData({ keyword: e.detail.value, foods });
  }
});
