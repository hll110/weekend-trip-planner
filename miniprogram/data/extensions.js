/** 扩展内容：区县、季节、节日、文化、方言、美食 */

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
  { id: 'summer', name: '夏季', icon: '☀️', desc: '避暑漂流、夜景璀璨' },
  { id: 'autumn', name: '秋季', icon: '🍂', desc: '红叶三峡、天高气爽' },
  { id: 'winter', name: '冬季', icon: '❄️', desc: '温泉滑雪、火锅暖胃' }
];

const festivals = [
  {
    id: 'hotpot',
    name: '重庆火锅文化节',
    period: '10月',
    district: '渝中区',
    desc: '全城火锅品牌联动，品尝地道九宫格',
    activities: ['火锅品鉴', '非遗展示', '夜市巡游']
  },
  {
    id: 'duanwu',
    name: '端午龙舟赛',
    period: '农历五月',
    district: '涪陵区',
    desc: '乌江、长江沿岸龙舟竞渡',
    activities: ['龙舟观赛', '艾草香包', '民俗体验']
  },
  {
    id: 'midautumn',
    name: '中秋山城灯会',
    period: '农历八月',
    district: '南岸区',
    desc: '南山、南滨路赏月灯会',
    activities: ['赏月', '灯会', '月饼制作']
  },
  {
    id: 'guoqing',
    name: '国庆山城灯光秀',
    period: '10月1日前后',
    district: '渝中区',
    desc: '解放碑、洪崖洞灯光秀与两江游',
    activities: ['灯光秀', '两江夜游', '城市徒步']
  },
  {
    id: 'newyear',
    name: '元旦跨年夜',
    period: '12月31日',
    district: '江北区',
    desc: '观音桥、解放碑跨年倒计时',
    activities: ['跨年倒计时', 'live演出', '深夜小面']
  },
  {
    id: 'chunjie',
    name: '春节庙会',
    period: '农历正月',
    district: '沙坪坝区',
    desc: '磁器口、古镇庙会与民俗表演',
    activities: ['舞龙舞狮', '庙会小吃', '非遗手工艺']
  }
];

const cultureArticles = [
  {
    id: 'bayu',
    title: '巴渝文化',
    summary: '重庆是巴文化发源地，山水与码头文化交融。',
    content: '早在商周时期，巴人在此繁衍生息。长江、嘉陵江汇流造就了独特的码头文化，吊脚楼、纤夫号子都是山城记忆。'
  },
  {
    id: 'diaojiaolou',
    title: '吊脚楼与洪崖洞',
    summary: '依山就势的建筑智慧，是8D魔幻山城的缩影。',
    content: '洪崖洞以巴渝传统吊脚楼形态为基础，夜间灯火辉映江面，成为重庆最具辨识度的城市名片之一。'
  },
  {
    id: 'chuandao',
    title: '长江索道与索道文化',
    summary: '跨越长江的空中走廊，见证工业山城向文旅名城转型。',
    content: '长江索道始建于上世纪80年代，曾是两岸市民日常交通工具，如今成为游客体验江景的经典项目。'
  },
  {
    id: 'zhazixi',
    title: '抗战陪都历史',
    summary: '二战时期重庆作为陪都，留下大量近现代史迹。',
    content: '解放碑原名抗战胜利纪功碑，周边分布抗战遗址博物馆、宋庆龄故居等，适合历史文化深度游。'
  },
  {
    id: 'hotpothistory',
    title: '火锅的起源',
    summary: '码头纤夫饮食智慧，演变为今日的城市味觉符号。',
    content: '九宫格便于分格涮煮不同食材，牛油锅底麻辣鲜香，与重庆潮湿气候形成独特饮食互补。'
  }
];

const dialectPhrases = [
  { phrase: '巴适得板', meaning: '非常好、很舒服', scene: '赞美风景或美食' },
  { phrase: '要得', meaning: '可以、好的', scene: '同意计划或安排' },
  { phrase: '莫得', meaning: '没有', scene: '回答有没有某物' },
  { phrase: '摆龙门阵', meaning: '聊天闲聊', scene: '休息喝茶时' },
  { phrase: '雄起', meaning: '加油、振作', scene: '徒步或登山鼓励' },
  { phrase: '瓜兮兮', meaning: '傻乎乎', scene: '轻松调侃同伴' },
  { phrase: '耙耳朵', meaning: '怕老婆、听妻子话', scene: '民俗幽默话题' },
  { phrase: '落教', meaning: '懂事、靠谱', scene: '称赞当地人热情' },
  { phrase: '惊乍乍', meaning: '大惊小怪', scene: '看到夜景感叹时' },
  { phrase: '搞快点儿', meaning: '赶快', scene: '赶景点或乘车' }
];

const foodsExtended = [
  { name: '重庆火锅', type: '火锅', desc: '牛油九宫格，麻辣鲜香', district: '全城', price: '人均80-150元' },
  { name: '重庆小面', type: '面食', desc: '豌豆杂酱、红油辣子', district: '渝中区', price: '人均12-20元' },
  { name: '酸辣粉', type: '小吃', desc: '红薯粉配花生碎', district: '沙坪坝区', price: '人均10-15元' },
  { name: '毛血旺', type: '江湖菜', desc: '鸭血黄喉豆芽合炒', district: '磁器口', price: '人均40-60元' },
  { name: '泉水鸡', type: '南山特色', desc: '麻辣鲜嫩，一鸡三吃', district: '南岸区', price: '人均70-100元' },
  { name: '万州烤鱼', type: '烤鱼', desc: '泡椒豆豉味型', district: '万州区', price: '人均50-80元' },
  { name: '合川桃片', type: '糕点', desc: '糯米核桃香甜', district: '合川区', price: '人均20-40元' },
  { name: '荣昌卤鹅', type: '卤味', desc: '皮脆肉嫩', district: '荣昌区', price: '人均50-70元' },
  { name: '涪陵榨菜', type: '特产', desc: '开胃爽脆', district: '涪陵区', price: '伴手礼' },
  { name: '酉阳土家腊肉', type: '农家', desc: '烟熏醇香', district: '酉阳县', price: '人均60-90元' },
  { name: '碗碗羊肉', type: '武隆', desc: '高山羊肉暖身', district: '武隆区', price: '人均50-70元' },
  { name: '抄手', type: '小吃', desc: '类似馄饨，红油干馏', district: '江北区', price: '人均15-25元' }
];

module.exports = {
  districts,
  seasons,
  festivals,
  cultureArticles,
  dialectPhrases,
  foodsExtended
};
