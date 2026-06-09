/** 微信地图导航 */

function openSpot(spot, fallback) {
  const lat = spot.lat || (fallback && fallback.lat);
  const lng = spot.lng || (fallback && fallback.lng);
  if (!lat || !lng) {
    wx.showToast({ title: '暂无坐标信息', icon: 'none' });
    return false;
  }
  wx.openLocation({
    latitude: Number(lat),
    longitude: Number(lng),
    name: spot.name || '目的地',
    address: spot.address || '重庆市',
    scale: 16
  });
  return true;
}

function openRouteFirstSpot(route) {
  if (!route) return false;
  const spot = (route.spots && route.spots[0]) || null;
  const fallback = route.location;
  if (!spot && !fallback) {
    wx.showToast({ title: '暂无导航信息', icon: 'none' });
    return false;
  }
  return openSpot(spot || { name: route.name }, fallback);
}

function showSpotPicker(route) {
  const spots = (route.spots || []).filter(s => s.lat && s.lng);
  if (spots.length === 0) {
    return openRouteFirstSpot(route);
  }
  if (spots.length === 1) {
    return openSpot(spots[0], route.location);
  }
  wx.showActionSheet({
    itemList: spots.map(s => s.name),
    success(res) {
      openSpot(spots[res.tapIndex], route.location);
    }
  });
  return true;
}

module.exports = {
  openSpot,
  openRouteFirstSpot,
  showSpotPicker
};
