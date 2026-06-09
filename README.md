# 渝趣周边游

一个微信小程序，专注于重庆及周边地区的短途旅行推荐，包含火锅美食、山城徒步、景区观光等多种路线。支持每条路线**多图轮播**展示。

## 🎯 核心功能

- 📍 **智能定位**：自动获取重庆当前位置或手动选择起始点
- 🗺️ **路线推荐**：推荐重庆市区及周边特色路线
- 🍲 **火锅美食**：路线包含重庆火锅、小面、江湖菜等特色美食
- ⛰️ **山城特色**：探索重庆8D魔幻地形和山城特色路线
- 🏞️ **景区观光**：游览重庆及周边著名景点（武隆、大足、酉阳等）
- ⏰ **时间筛选**：支持1日游、2日游筛选
- 🔍 **类型筛选**：火锅美食、山城徒步、景区观光
- 📱 **重庆主题**：红色主题设计，符合重庆特色

## 🏙️ 重庆特色路线

### 市区经典路线
1. **重庆市区经典一日游**：解放碑、洪崖洞、长江索道、李子坝轻轨穿楼
2. **磁器口古镇怀旧之旅**：千年古镇、地道小吃、码头文化
3. **解放碑夜景美食之旅**：夜游解放碑、品尝夜市小吃

### 美食路线
4. **重庆火锅美食两日游**：火锅博物馆、火锅一条街、夜市小吃
5. **磁器口美食探索**：陈麻花、古镇鸡杂、毛血旺

### 周边自然风光
6. **武隆天生三桥一日游**：《变形金刚4》取景地、世界自然遗产
7. **大足石刻文化一日游**：世界文化遗产、千年佛教艺术
8. **酉阳桃花源两日游**：陶渊明笔下的世外桃源、土家族风情
9. **白帝城瞿塘峡一日游**：三峡壮美风光、诗词文化

### 特色体验
10. **南山一棵树徒步观景**：徒步南山、俯瞰重庆全景
11. **金佛山滑雪温泉两日游**：冬季滑雪、夏季避暑

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
2. 导入项目：选择仓库根目录 `weekend-trip-planner`（已配置 `miniprogramRoot`，无需只选子目录）
3. AppID：使用测试号或项目中的 AppID；正式发布需替换为真实 AppID
4. **默认使用内置路线**（`miniprogram/config.js` 中 `enableRemoteApi: false`），无需启动后端、也不会出现域名校验报错
5. 若需联调后端：先启动 `server`，将 `enableRemoteApi` 改为 `true`，并在 详情 → 本地设置 → 勾选「不校验合法域名」，然后重新编译
6. 若仍提示域名校验：检查 `project.private.config.json` 中 `urlCheck` 是否为 `false`，或工具栏重新「编译」

### 3. 测试API
```bash
# 获取所有路线
curl http://localhost:9091/api/routes

# 获取火锅美食路线
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
| 🗺️ 全部路线 | 31条 | 重庆市区及周边精选路线 |
| 🍲 火锅美食 | 2条 | 以重庆火锅和特色小吃为主 |
| ⛰️ 山城徒步 | 7条 | 适合徒步和户外活动 |
| 🏞️ 景区观光 | 22条 | 以景点观光为主 |
| 📅 1日游 | 28条 | 适合周末一天 |
| 📅 2日游 | 3条 | 适合周末两天 |

## 🏗️ 技术架构

### 前端 (微信小程序)
- **框架**：微信小程序原生开发
- **UI设计**：重庆红色主题设计
- **功能**：定位、筛选、路线展示、详情页
- **优化**：本地缓存、流畅动画

### 后端 (Flask API)
- **框架**：Python Flask + Flask-CORS
- **数据**：重庆及周边路线数据
- **API**：RESTful设计，支持筛选、搜索、随机推荐
- **性能**：内存缓存，快速响应

## 📁 项目结构

```
weekend-trip-planner/
├── project.config.json       # 微信项目配置（含 miniprogramRoot）
├── miniprogram/              # 微信小程序前端
│   ├── pages/
│   │   ├── index/           # 首页（位置、筛选、路线列表）
│   │   ├── route-detail/    # 路线详情页（景点、美食、行程）
│   │   ├── filter/          # 高级筛选页
│   │   ├── discover/        # 发现（天气/方言/节日/区县）
│   │   ├── food-guide/      # 美食图鉴
│   │   ├── culture/         # 巴渝文化
│   │   ├── my-routes/       # 用户分享路线
│   │   └── location-picker/ # 位置选择页
│   ├── data/
│   │   ├── routes.js        # ⭐ 路线主数据（新增路线改这个文件）
│   │   ├── routes.json      # 可选备份，改后运行 node scripts/sync-routes.js
│   │   └── route-template.json
│   ├── utils/               # 天气、导航、筛选、用户路线
│   ├── images/
│   │   └── routes/          # 路线多图：{id}-1.jpg、{id}-2.jpg …
│   ├── app.js               # 小程序入口
│   ├── app.json             # 小程序配置
│   └── app.wxss             # 全局样式
├── server/                   # Flask后端API
│   ├── app.py               # Flask应用（重庆路线数据API）
│   ├── requirements.txt     # Python依赖
│   ├── Dockerfile           # Docker配置
│   └── ...
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
- **重庆主题**：红色主色调，体现重庆特色
- **山城元素**：融入重庆8D魔幻地形设计元素
- **火锅文化**：美食部分采用火锅红色主题
- **现代感**：现代化UI设计，符合微信小程序规范

### 色彩系统
- **主色调**：重庆红 (#c41e2a) → 火锅橙 (#e53e3e)
- **美食色**：火锅橙 (#dd6b20) → 金色 (#ed8936)
- **自然色**：山城绿 (#38a169) → 江水绿 (#48bb78)
- **文化色**：历史金 (#d69e2e) → 琥珀 (#ecc94b)

### 组件设计
- **卡片**：圆角20rpx，红色阴影，内边距32rpx
- **按钮**：重庆红渐变背景，圆角16rpx
- **标签**：重庆红背景色，圆角20rpx
- **列表**：清晰分隔，红色悬停效果

## 📝 新增路线（最简单）

**只需 2 步：**

1. 打开 `miniprogram/data/routes.js`，复制 `route-template.json` 模板对象到数组末尾，改 `id`、`name`、`images` 等字段  
2. 把照片放到 `miniprogram/images/routes/`，命名为 `{id}-1.jpg`、`{id}-2.jpg` …

详细说明见 **[docs/新增路线.md](docs/新增路线.md)**。

当前路线图片已**下载到本地** `miniprogram/images/routes/`（共 34 张），数据里使用 `/images/routes/{id}-1.jpg` 等形式，**无需配置图片域名**。

批量换图并写回 `routes.js`：

```bash
# 1. 编辑 miniprogram/data/route-image-sources.js（填写可下载的图片 URL）
# 2. 下载到本地并更新 routes.js / routes.json
node scripts/download-route-images.js
```

手动添加本地图示例：

```json
"images": ["/images/routes/13-1.jpg", "/images/routes/13-2.jpg"]
```

保存后 **重新编译** 即可。

### 后端联调（可选）

将同结构的 JSON 放到项目根目录 `routes_data.json`，并设置 `enableRemoteApi: true`。

### 添加新分类
1. 编辑 `server/app.py` 中的 `/api/categories` 端点
2. 编辑 `miniprogram/app.js` 中的筛选逻辑

### 自定义样式
- 全局样式：`miniprogram/app.wxss`
- 页面样式：对应页面目录下的 `.wxss` 文件
- 主题颜色：修改 `app.wxss` 中的颜色变量

## ⚠️ 注意事项

1. **位置权限**：需要用户授权位置信息
2. **网络请求**：小程序需HTTPS（开发阶段可关闭域名校验）
3. **图片资源**：需要准备重庆景点图片，建议尺寸750x400
4. **数据扩展**：当前为示例数据，可扩展更多重庆及周边路线
5. **重庆特色**：UI设计融入重庆红色文化、火锅文化、山城特色

## 🚀 部署指南

### Docker部署
```bash
cd server
docker build -t chongqing-trip .
docker run -d -p 9091:9091 chongqing-trip
```

### 生产环境
1. 修改 `app.js` 中的 `baseUrl` 为实际API地址
2. 在微信后台配置服务器域名
3. 上传小程序代码并提交审核
4. 配置HTTPS证书

## 🎯 后续扩展

### 功能扩展（已实现）
1. **重庆天气**：首页/发现页展示按月模拟的重庆出行天气与贴士（`utils/weather.js`，API `/api/weather`）
2. **重庆导航**：路线详情点击景点或「开始导航」，调用 `wx.openLocation` 打开微信地图（`utils/navigation.js`）
3. **重庆美食**：美食图鉴页 `pages/food-guide`，12+ 种特色美食
4. **重庆文化**：巴渝文化页 `pages/culture`，路线详情关联文化词条
5. **重庆方言**：首页/发现/详情随机展示方言短句，发现页可点击换一句

### 数据扩展（已实现）
1. **更多区县**：38 个区县数据，首页/筛选/发现支持区县筛选
2. **季节特色**：路线标注春夏秋冬，首页与筛选可按季节过滤
3. **节日活动**：6 项节日活动，发现页可跳转对应路线筛选
4. **用户生成**：`pages/my-routes` 分享自定义路线，本地存储并合并至路线列表

**入口**：底部 Tab「发现」；联调后端时访问 `/api/extensions`、`/api/weather`

## 📞 联系方式

- **项目地址**：https://github.com/hll110/weekend-trip-planner
- **问题反馈**：创建GitHub Issue
- **功能建议**：欢迎提交Pull Request

---

**渝趣周边游** - 发现山城之美! 🏙️

**火锅相伴，山城相随，渝趣周边游等你来探索！**