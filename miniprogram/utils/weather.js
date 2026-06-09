/** 重庆出行天气（按月份模拟，可对接 /api/weather） */

const MONTH_PROFILE = {
  1: { temp: 8, desc: '阴冷有雾', humidity: 85, icon: '🌫️', tip: '备羽绒服，注意防滑' },
  2: { temp: 10, desc: '湿冷多雨', humidity: 82, icon: '🌧️', tip: '带伞，火锅暖胃' },
  3: { temp: 16, desc: '春暖花开', humidity: 75, icon: '🌸', tip: '适合踏青、缙云山' },
  4: { temp: 22, desc: '温和多云', humidity: 70, icon: '⛅', tip: '磁器口、桃花源最佳' },
  5: { temp: 25, desc: '闷热转热', humidity: 72, icon: '🌤️', tip: '早晚出行，补水防晒' },
  6: { temp: 28, desc: '闷热多雨', humidity: 78, icon: '🌦️', tip: '武隆、漂流避暑' },
  7: { temp: 32, desc: '高温酷暑', humidity: 75, icon: '☀️', tip: '室内博物馆，夜游两江' },
  8: { temp: 33, desc: '炙热晴热', humidity: 72, icon: '🔥', tip: '高山景区避暑优先' },
  9: { temp: 26, desc: '秋高气爽', humidity: 68, icon: '🍂', tip: '三峡红叶季预热' },
  10: { temp: 20, desc: '凉爽宜人', humidity: 70, icon: '🍁', tip: '火锅节、国庆灯光秀' },
  11: { temp: 15, desc: '微凉多雾', humidity: 78, icon: '🌁', tip: '南山赏秋、温泉可选' },
  12: { temp: 10, desc: '阴冷湿冷', humidity: 80, icon: '❄️', tip: '金佛山滑雪、跨年活动' }
};

function getCurrentSeason(month) {
  const m = month || new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

function getChongqingWeather(date) {
  const d = date || new Date();
  const month = d.getMonth() + 1;
  const profile = MONTH_PROFILE[month] || MONTH_PROFILE[4];
  const season = getCurrentSeason(month);
  const seasonNames = { spring: '春季', summer: '夏季', autumn: '秋季', winter: '冬季' };

  return {
    city: '重庆',
    month,
    season,
    seasonName: seasonNames[season],
    temp: profile.temp,
    tempRange: `${profile.temp - 3}~${profile.temp + 4}°C`,
    description: profile.desc,
    humidity: profile.humidity,
    icon: profile.icon,
    travelTip: profile.tip,
    updatedAt: `${d.getFullYear()}-${month}-${d.getDate()}`
  };
}

module.exports = {
  getChongqingWeather,
  getCurrentSeason
};
