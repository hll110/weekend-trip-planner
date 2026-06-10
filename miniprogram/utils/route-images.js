const config = require('../config.js');
const { enrichAudience } = require('./route-audience.js');

const FALLBACK_POOL = [
  config.placeholderImage,
  '/images/share-bg.png'
];

/**
 * 统一路线图片字段：支持 images 数组，兼容旧版 image 单图
 * 推荐图片路径：/packageRoutes/images/routes/{路线id}-1.jpg
 */
function normalizeImages(route) {
  if (route.images && route.images.length > 0) {
    return route.images.filter(Boolean);
  }
  if (route.image) {
    return [route.image];
  }
  const count = Math.min(4, Math.max(2, (route.highlights || []).length || 2));
  return Array.from({ length: count }, (_, i) => FALLBACK_POOL[i % FALLBACK_POOL.length]);
}

function enrichRoute(route, districtName) {
  const images = normalizeImages(route);
  return {
    ...route,
    ...enrichAudience(route),
    images,
    image: images[0],
    imageCount: images.length,
    districtName: districtName || route.districtName || ''
  };
}

module.exports = {
  normalizeImages,
  enrichRoute,
  FALLBACK_POOL
};
