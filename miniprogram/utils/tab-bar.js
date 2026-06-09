/** 同步自定义 TabBar 选中态 */
const TAB_INDEX = {
  '/pages/index/index': 0,
  '/pages/discover/discover': 1,
  '/pages/filter/filter': 2
};

function setTabSelected(page, index) {
  if (typeof page.getTabBar !== 'function') return;
  const tabBar = page.getTabBar();
  if (tabBar) {
    tabBar.setData({ selected: index });
  }
}

function setTabByRoute(page) {
  const route = page.route || '';
  const path = route.startsWith('/') ? route : `/${route}`;
  const index = TAB_INDEX[path];
  if (index !== undefined) {
    setTabSelected(page, index);
  }
}

module.exports = {
  setTabSelected,
  setTabByRoute,
  TAB_INDEX
};
