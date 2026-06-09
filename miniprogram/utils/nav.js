/** 页面跳转封装（tab 页必须用 switchTab） */
const TAB_PAGES = [
  '/pages/index/index',
  '/pages/discover/discover',
  '/pages/filter/filter'
];

function isTabPage(url) {
  const path = url.split('?')[0];
  return TAB_PAGES.includes(path);
}

function open(url) {
  if (isTabPage(url)) {
    wx.switchTab({ url: pathOnly(url) });
  } else {
    wx.navigateTo({ url });
  }
}

function pathOnly(url) {
  return url.split('?')[0];
}

function toHome() {
  wx.switchTab({ url: '/pages/index/index' });
}

function toDiscover() {
  wx.switchTab({ url: '/pages/discover/discover' });
}

function toFilter() {
  wx.switchTab({ url: '/pages/filter/filter' });
}

function toRouteDetail(id) {
  wx.navigateTo({ url: `/packageRoutes/pages/route-detail/route-detail?id=${id}` });
}

module.exports = {
  open,
  toHome,
  toDiscover,
  toFilter,
  toRouteDetail
};
