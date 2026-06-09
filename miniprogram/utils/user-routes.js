const STORAGE_KEY = 'userRoutes';
const ID_START = 10000;

function load() {
  return wx.getStorageSync(STORAGE_KEY) || [];
}

function save(list) {
  wx.setStorageSync(STORAGE_KEY, list);
}

function nextId(list) {
  const ids = list.map(r => Number(r.id));
  const max = ids.length ? Math.max(...ids) : ID_START - 1;
  return Math.max(max + 1, ID_START);
}

function add(route) {
  const list = load();
  const item = {
    id: nextId(list),
    isUserRoute: true,
    type: route.type || 'scenic',
    duration: route.duration || '1day',
    district: route.district || 'yuzhong',
    seasons: route.seasons || ['spring', 'summer', 'autumn', 'winter'],
    festivals: [],
    distance: route.distance || '自定',
    rating: 4.5,
    reviews: 1,
    description: route.description || '',
    highlights: route.highlights ? route.highlights.split(/[,，]/).map(s => s.trim()).filter(Boolean) : [],
    food: route.food ? route.food.split(/[,，]/).map(s => s.trim()).filter(Boolean) : [],
    spots: [{ name: route.spotName || '自定义景点', time: '自定', ticket: '待定', lat: route.lat, lng: route.lng }],
    foodSpots: [],
    tags: ['用户分享'],
    location: { lat: route.lat || 29.563, lng: route.lng || 106.551 },
    images: route.images && route.images.length
      ? route.images
      : ['/images/placeholder.png'],
    createdAt: Date.now()
  };
  item.name = route.name || '我的路线';
  item.image = item.images[0];
  list.unshift(item);
  save(list);
  return item;
}

function remove(id) {
  const list = load().filter(r => Number(r.id) !== Number(id));
  save(list);
  return list;
}

module.exports = {
  load,
  save,
  add,
  remove
};
