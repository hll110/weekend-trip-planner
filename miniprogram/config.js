/**
 * 小程序运行配置
 *
 * 开发预览（默认）：enableRemoteApi = false，使用内置路线，不请求 localhost
 * 联调后端：改为 enableRemoteApi = true，并启动 server；
 *   同时在微信开发者工具勾选「不校验合法域名」
 *
 * 路线图片存放在 miniprogram/packageRoutes/images/routes/（分包，无需配置图片域名）
 */
module.exports = {
  /** 是否请求远程 API（false = 仅用本地数据，避免域名校验报错） */
  enableRemoteApi: false,
  baseUrl: 'http://127.0.0.1:9091/api',
  requestTimeout: 8000,
  defaultLocation: {
    latitude: 29.563,
    longitude: 106.551,
    name: '重庆',
    address: '重庆市渝中区'
  },
  placeholderImage: '/images/placeholder.png',
  requestLimit: 50
};
