/** 扩展数据：区县、季节 */

const districts = [
  { id: 'all', name: '全部区县' },
  { id: 'yuzhong', name: '渝中区' },
  { id: 'jiangbei', name: '江北区' },
  { id: 'nanan', name: '南岸区' },
  { id: 'shapingba', name: '沙坪坝区' },
  { id: 'jiulongpo', name: '九龙坡区' },
  { id: 'yubei', name: '渝北区' },
  { id: 'banan', name: '巴南区' },
  { id: 'beibei', name: '北碚区' },
  { id: 'wulong', name: '武隆区' },
  { id: 'dazu', name: '大足区' },
  { id: 'youyang', name: '酉阳县' },
  { id: 'wushan', name: '巫山县' },
  { id: 'nanchuan', name: '南川区' },
  { id: 'wanzhou', name: '万州区' },
  { id: 'fengdu', name: '丰都县' },
  { id: 'fengjie', name: '奉节县' },
  { id: 'zhongxian', name: '忠县' },
  { id: 'fuling', name: '涪陵区' },
  { id: 'qianjiang', name: '黔江区' },
  { id: 'changshou', name: '长寿区' },
  { id: 'jiangjin', name: '江津区' },
  { id: 'hechuan', name: '合川区' },
  { id: 'yongchuan', name: '永川区' },
  { id: 'bishan', name: '璧山区' },
  { id: 'tongliang', name: '铜梁区' },
  { id: 'rongchang', name: '荣昌区' },
  { id: 'kaizhou', name: '开州区' },
  { id: 'liangping', name: '梁平区' },
  { id: 'chengkou', name: '城口县' },
  { id: 'dianjiang', name: '垫江县' },
  { id: 'yunyang', name: '云阳县' },
  { id: 'wuxi', name: '巫溪县' },
  { id: 'shizhu', name: '石柱县' },
  { id: 'xiushan', name: '秀山县' },
  { id: 'pengshui', name: '彭水县' }
];

const seasons = [
  { id: 'all', name: '全季', icon: '🗓️' },
  { id: 'spring', name: '春季', icon: '🌸', desc: '赏花踏青、温和湿润' },
  { id: 'summer', name: '夏季', icon: '☀️', desc: '避暑漂流、绿意盎然' },
  { id: 'autumn', name: '秋季', icon: '🍂', desc: '红叶三峡、天高气爽' },
  { id: 'winter', name: '冬季', icon: '❄️', desc: '温泉滑雪、冬日徒步' }
];

module.exports = {
  districts,
  seasons
};
