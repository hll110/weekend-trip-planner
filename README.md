# 周边游助手 (Weekend Trip Planner)

一个微信小程序，帮助用户规划周末周边短途旅行，根据当前位置推荐包含美食和景点的路线。

## 🎯 核心功能

- 📍 **智能定位**：自动获取当前位置或手动选择起始点
- 🗺️ **路线推荐**：根据不同类型推荐短途游路线
- 🍽️ **美食整合**：路线包含各地特色美食推荐
- 🏞️ **景点推荐**：精选周边热门景点和隐藏宝藏
- ⏰ **时间筛选**：支持1日游、2日游筛选
- 🔍 **类型筛选**：美食优先、徒步路线、景区优先
- 📱 **美观UI**：现代化设计，流畅用户体验

## 🚀 快速开始

### 1. 启动后端服务
```bash
cd /opt/Project/weekend-trip-planner
./start.sh
# 或手动启动
cd server && python3 app.py
```

后端将在 http://localhost:9091 启动

### 2. 配置微信小程序
1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入项目：选择 `miniprogram` 目录
3. AppID：测试可使用 `wxAppId`，发布需真实AppID
4. 点击“编译”即可预览

### 3. 测试API
```bash
# 获取所有路线
curl http://localhost:9091/api/routes

# 获取美食优先路线
curl "http://localhost:9091/api/routes?type=food"

# 获取1日游路线
curl "http://localhost:9091/api/routes?duration=1day"

# 获取随机推荐
curl http://localhost:9091/api/routes/random

# 获取统计信息
curl http://localhost:9091/api/stats
```

## 📊 数据统计

| 分类 | 数量 | 描述 |
|------|------|------|
| 🗺️ 全部路线 | 6条 | 北京、上海等地经典路线 |
| 🍽️ 美食优先 | 1条 | 以美食探索为主 |
| 🥾 徒步路线 | 2条 | 适合徒步和户外活动 |
| 🏞️ 景区优先 | 3条 | 以景点观光为主 |
| 📅 1日游 | 5条 | 适合周末一天 |
| 📅 2日游 | 1条 | 适合周末两天 |

## 🏗️ 技术架构

### 前端 (微信小程序)
- **框架**：微信小程序原生开发
- **UI设计**：现代化UI/UX设计
- **功能**：定位、筛选、路线展示、详情页
- **优化**：本地缓存、流畅动画

### 后端 (Flask API)
- **框架**：Python Flask + Flask-CORS
- **数据**：JSON数据存储
- **API**：RESTful设计，支持筛选、搜索、随机推荐
- **性能**：内存缓存，快速响应

## 📁 项目结构

```
weekend-trip-planner/
├── miniprogram/              # 微信小程序前端
│   ├── pages/
│   │   ├── index/           # 首页（位置、筛选、路线列表）
│   │   ├── route-detail/    # 路线详情页（景点、美食、行程）
│   │   ├── filter/          # 高级筛选页
│   │   └── location-picker/ # 位置选择页
│   ├── utils/               # 工具函数
│   ├── images/              # 图标和图片
│   ├── app.js               # 小程序入口
│   ├── app.json             # 小程序配置
│   └── app.wxss             # 全局样式
├── server/                   # Flask后端API
│   ├── app.py               # Flask应用（路线数据API）
│   ├── requirements.txt     # Python依赖
│   ├── Dockerfile           # Docker配置
│   ├── static/              # 静态资源
│   └── templates/           # 模板文件
├── project.config.json       # 微信项目配置
├── package.json              # 项目元数据
├── start.sh                  # 一键启动脚本
└── README.md                 # 项目文档
```

## 🔧 API文档

### 基础端点

| 端点 | 方法 | 描述 | 参数 |
|------|------|------|------|
| `/` | GET | API信息 | - |
| `/api/health` | GET | 健康检查 | - |
| `/api/routes` | GET | 获取路线列表 | `lat`, `lon`, `type`, `duration`, `limit` |
| `/api/routes/:id` | GET | 获取路线详情 | - |
| `/api/routes/random` | GET | 随机推荐 | `count` |
| `/api/categories` | GET | 获取分类 | - |
| `/api/search` | GET | 搜索路线 | `q` |
| `/api/stats` | GET | 统计信息 | - |

### 筛选参数

- `type`: 路线类型 (`all`, `food`, `hiking`, `scenic`)
- `duration`: 行程时长 (`all`, `1day`, `2day`)
- `lat`, `lon`: 位置坐标（用于距离排序）
- `limit`: 返回数量限制

## 🎨 UI/UX设计特点

### 设计原则
- **现代化**：渐变色、圆角、阴影、动画
- **一致性**：统一的色彩体系、字体、间距
- **可访问性**：清晰的对比度、合适的字体大小
- **响应式**：适配不同屏幕尺寸

### 色彩系统
- **主色调**：靛蓝 (#4f46e5) → 紫色 (#7c3aed)
- **强调色**：琥珀 (#f59e0b) → 橙色 (#f97316)
- **成功色**：翡翠 (#10b981) → 青色 (#14b8a6)
- **中性色**：石板灰系列 (#1e293b, #64748b, #94a3b8)

### 组件设计
- **卡片**：圆角20rpx，阴影8rpx，内边距32rpx
- **按钮**：渐变背景，圆角16rpx，悬停效果
- **标签**：圆角20rpx，轻量背景色
- **列表**：清晰分隔，悬停效果

## 📝 开发指南

### 添加新路线
1. 编辑 `server/app.py` 中的 `ROUTES_DATA` 数组
2. 添加路线对象，包含以下字段：
   ```json
   {
     "id": 唯一ID,
     "name": "路线名称",
     "type": "路线类型",
     "duration": "行程时长",
     "distance": "总距离",
     "rating": 评分,
     "reviews": 评价数量,
     "description": "路线描述",
     "image": "图片路径",
     "highlights": ["亮点1", "亮点2"],
     "food": ["美食1", "美食2"],
     "spots": [{"name": "景点", "time": "时间", "ticket": "门票"}],
     "foodSpots": [{"name": "餐厅", "type": "类型", "price": "价格"}],
     "tags": ["标签1", "标签2"],
     "location": {"lat": 纬度, "lng": 经度}
   }
   ```
3. 重启后端服务

### 添加新分类
1. 编辑 `server/app.py` 中的 `/api/categories` 端点
2. 编辑 `miniprogram/app.js` 中的筛选逻辑

### 自定义样式
- 全局样式：`miniprogram/app.wxss`
- 页面样式：对应页面目录下的 `.wxss` 文件
- 主题颜色：修改 `app.wxss` 中的颜色变量

## ⚠️ 注意事项

1. **微信限制**：小程序网络请求需HTTPS（开发阶段可关闭域名校验）
2. **位置权限**：需要用户授权位置信息
3. **数据存储**：当前使用内存存储，生产环境建议使用数据库
4. **图片资源**：需要准备路线图片，建议尺寸750x400
5. **API性能**：大量数据时建议添加分页和缓存

## 🚀 部署指南

### Docker部署
```bash
cd server
docker build -t weekend-trip-planner .
docker run -d -p 9090:9090 weekend-trip-planner
```

### 生产环境
1. 修改 `app.js` 中的 `baseUrl` 为实际API地址
2. 在微信后台配置服务器域名
3. 上传小程序代码并提交审核
4. 配置HTTPS证书

## 🎯 后续扩展

### 功能扩展
1. **实时天气**：集成天气API，显示出行天气
2. **导航集成**：接入地图导航功能
3. **用户系统**：收藏、评分、评论功能
4. **社交分享**：分享路线到微信朋友圈
5. **离线地图**：支持离线地图和路线

### 数据扩展
1. **更多城市**：扩展到全国主要城市
2. **用户生成**：用户上传自己的路线
3. **实时更新**：景点、餐厅信息实时更新
4. **个性化推荐**：基于用户偏好的智能推荐

## 📞 联系方式

- **项目地址**：https://github.com/hll110/weekend-trip-planner
- **问题反馈**：创建GitHub Issue
- **功能建议**：欢迎提交Pull Request

---

**周边游助手** - 让每个周末都充满精彩! 🌟

**智能推荐，美食相伴，美景相随！**