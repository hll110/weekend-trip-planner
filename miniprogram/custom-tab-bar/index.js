const TAB_INDEX = {
  'pages/index/index': 0,
  'pages/discover/discover': 1,
  'pages/filter/filter': 2
};

Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/index/index',
        text: '路线',
        icon: '🥾'
      },
      {
        pagePath: '/pages/discover/discover',
        text: '探索',
        icon: '🧭'
      },
      {
        pagePath: '/pages/filter/filter',
        text: '筛选',
        icon: '🔍'
      }
    ]
  },

  lifetimes: {
    attached() {
      const pages = getCurrentPages();
      const cur = pages[pages.length - 1];
      if (!cur || !cur.route) return;
      const idx = TAB_INDEX[cur.route];
      if (idx !== undefined) {
        this.setData({ selected: idx });
      }
    }
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const path = this.data.list[index].pagePath;
      wx.switchTab({ url: path });
      this.setData({ selected: index });
    }
  }
});
