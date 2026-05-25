from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import random

app = Flask(__name__)
CORS(app)

# 重庆及周边路线数据
ROUTES_DATA = [
    {
        "id": 1,
        "name": "重庆市区经典一日游",
        "type": "scenic",
        "duration": "1day",
        "distance": "20公里",
        "rating": 4.9,
        "reviews": 356,
        "description": "探索山城重庆，感受8D魔幻都市魅力",
        "image": "/images/chongqing-city.jpg",
        "highlights": ["解放碑", "洪崖洞", "长江索道", "李子坝轻轨穿楼"],
        "food": ["重庆火锅", "小面", "酸辣粉"],
        "spots": [
            {"name": "解放碑步行街", "time": "1-2小时", "ticket": "免费"},
            {"name": "洪崖洞民俗风貌区", "time": "2-3小时", "ticket": "免费"},
            {"name": "长江索道", "time": "1小时", "ticket": "单程20元"},
            {"name": "李子坝轻轨穿楼", "time": "30分钟", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "珮姐老火锅", "type": "九宫格火锅", "price": "人均120元"},
            {"name": "花市豌杂面", "type": "重庆小面", "price": "人均15元"}
        ],
        "tags": ["市区", "经典", "8D魔幻", "网红打卡"],
        "location": {"lat": 29.563, "lng": 106.551}
    },
    {
        "id": 2,
        "name": "重庆火锅美食两日游",
        "type": "food",
        "duration": "2day",
        "distance": "15公里",
        "rating": 4.8,
        "reviews": 289,
        "description": "品尝地道重庆火锅，体验麻辣鲜香的美食文化",
        "image": "/images/hotpot.jpg",
        "highlights": ["火锅博物馆", "火锅一条街", "夜市小吃"],
        "food": ["九宫格火锅", "毛肚火锅", "串串香", "江湖菜"],
        "spots": [
            {"name": "重庆火锅博物馆", "time": "1-2小时", "ticket": "免费"},
            {"name": "南滨路美食街", "time": "2-3小时", "ticket": "免费"},
            {"name": "观音桥好吃街", "time": "2小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "周师兄大刀腰片火锅", "type": "腰片火锅", "price": "人均130元"},
            {"name": "楠火锅", "type": "复古火锅", "price": "人均100元"},
            {"name": "胡记蹄花汤", "type": "蹄花汤", "price": "人均40元"}
        ],
        "tags": ["火锅", "美食", "两日游", "地道小吃"],
        "location": {"lat": 29.557, "lng": 106.573}
    },
    {
        "id": 3,
        "name": "南山一棵树徒步观景",
        "type": "hiking",
        "duration": "1day",
        "distance": "8公里",
        "rating": 4.7,
        "reviews": 178,
        "description": "徒步南山，俯瞰重庆全景，欣赏最美夜景",
        "image": "/images/nanshan.jpg",
        "highlights": ["南山一棵树", "南山植物园", "老君洞"],
        "food": ["南山泉水鸡", "农家菜"],
        "spots": [
            {"name": "南山一棵树观景台", "time": "2小时", "ticket": "30元"},
            {"name": "南山植物园", "time": "2-3小时", "ticket": "免费"},
            {"name": "老君洞", "time": "1小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "南山泉水鸡一条街", "type": "泉水鸡", "price": "人均80元"}
        ],
        "tags": ["徒步", "夜景", "自然", "观景"],
        "location": {"lat": 29.533, "lng": 106.596}
    },
    {
        "id": 4,
        "name": "武隆天生三桥一日游",
        "type": "scenic",
        "duration": "1day",
        "distance": "170公里",
        "rating": 4.9,
        "reviews": 412,
        "description": "探索《变形金刚4》取景地，感受大自然的鬼斧神工",
        "image": "/images/wulong.jpg",
        "highlights": ["天生三桥", "龙水峡地缝", "仙女山"],
        "food": ["武隆碗碗羊肉", "烤全羊"],
        "spots": [
            {"name": "天生三桥", "time": "3-4小时", "ticket": "95元"},
            {"name": "龙水峡地缝", "time": "2小时", "ticket": "85元"},
            {"name": "仙女山国家森林公园", "time": "2-3小时", "ticket": "60元"}
        ],
        "foodSpots": [
            {"name": "武隆碗碗羊肉", "type": "碗碗羊肉", "price": "人均50元"}
        ],
        "tags": ["自然风光", "电影取景地", "世界遗产"],
        "location": {"lat": 29.428, "lng": 107.760}
    },
    {
        "id": 5,
        "name": "大足石刻文化一日游",
        "type": "scenic",
        "duration": "1day",
        "distance": "110公里",
        "rating": 4.8,
        "reviews": 267,
        "description": "参观世界文化遗产，感受千年佛教艺术",
        "image": "/images/dazu.jpg",
        "highlights": ["宝顶山石刻", "北山石刻", "大足石刻博物馆"],
        "food": ["大足邮亭鲫鱼", "冬菜尖"],
        "spots": [
            {"name": "宝顶山石刻", "time": "3-4小时", "ticket": "115元"},
            {"name": "北山石刻", "time": "2小时", "ticket": "70元"},
            {"name": "大足石刻博物馆", "time": "1小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "邮亭鲫鱼", "type": "邮亭鲫鱼", "price": "人均60元"}
        ],
        "tags": ["文化", "世界遗产", "佛教艺术"],
        "location": {"lat": 29.707, "lng": 105.722}
    },
    {
        "id": 6,
        "name": "磁器口古镇怀旧之旅",
        "type": "food",
        "duration": "1day",
        "distance": "10公里",
        "rating": 4.6,
        "reviews": 234,
        "description": "漫步千年古镇，品尝地道小吃，感受老重庆风情",
        "image": "/images/ciqikou.jpg",
        "highlights": ["磁器口古镇", "宝轮寺", "码头文化"],
        "food": ["陈麻花", "古镇鸡杂", "毛血旺"],
        "spots": [
            {"name": "磁器口古镇", "time": "3-4小时", "ticket": "免费"},
            {"name": "宝轮寺", "time": "1小时", "ticket": "免费"},
            {"name": "码头遗址", "time": "30分钟", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "陈麻花总店", "type": "陈麻花", "price": "人均20元"},
            {"name": "古镇鸡杂", "type": "鸡杂", "price": "人均40元"}
        ],
        "tags": ["古镇", "小吃", "怀旧", "文化"],
        "location": {"lat": 29.585, "lng": 106.453}
    },
    {
        "id": 7,
        "name": "金佛山滑雪温泉两日游",
        "type": "hiking",
        "duration": "2day",
        "distance": "130公里",
        "rating": 4.7,
        "reviews": 156,
        "description": "冬季滑雪泡温泉，夏季避暑赏杜鹃",
        "image": "/images/jinfoshan.jpg",
        "highlights": ["金佛山滑雪场", "天星温泉", "古佛洞"],
        "food": ["方竹笋", "烤全羊"],
        "spots": [
            {"name": "金佛山滑雪场", "time": "4-5小时", "ticket": "滑雪票200元"},
            {"name": "天星国际温泉", "time": "2-3小时", "ticket": "128元"},
            {"name": "古佛洞", "time": "1小时", "ticket": "40元"}
        ],
        "foodSpots": [
            {"name": "金佛山农家乐", "type": "方竹笋宴", "price": "人均80元"}
        ],
        "tags": ["滑雪", "温泉", "避暑", "两日游"],
        "location": {"lat": 29.058, "lng": 107.183}
    },
    {
        "id": 8,
        "name": "酉阳桃花源两日游",
        "type": "scenic",
        "duration": "2day",
        "distance": "340公里",
        "rating": 4.8,
        "reviews": 198,
        "description": "探寻陶渊明笔下的世外桃源，感受土家族风情",
        "image": "/images/youyang.jpg",
        "highlights": ["桃花源景区", "龚滩古镇", "乌江画廊"],
        "food": ["土家菜", "乌江鱼"],
        "spots": [
            {"name": "酉阳桃花源", "time": "3-4小时", "ticket": "100元"},
            {"name": "龚滩古镇", "time": "2-3小时", "ticket": "免费"},
            {"name": "乌江画廊游船", "time": "2小时", "ticket": "120元"}
        ],
        "foodSpots": [
            {"name": "龚滩古镇土家菜", "type": "土家菜", "price": "人均60元"}
        ],
        "tags": ["世外桃源", "古镇", "土家族", "两日游"],
        "location": {"lat": 28.839, "lng": 108.773}
    },
    {
        "id": 9,
        "name": "白帝城瞿塘峡一日游",
        "type": "scenic",
        "duration": "1day",
        "distance": "400公里",
        "rating": 4.9,
        "reviews": 312,
        "description": "朝辞白帝彩云间，感受三峡壮美风光",
        "image": "/images/baidicheng.jpg",
        "highlights": ["白帝城", "瞿塘峡", "夔门"],
        "food": ["奉节脐橙", "三峡鱼"],
        "spots": [
            {"name": "白帝城景区", "time": "2-3小时", "ticket": "100元"},
            {"name": "瞿塘峡游船", "time": "2小时", "ticket": "150元"},
            {"name": "夔门观景台", "time": "1小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "奉节脐橙采摘", "type": "脐橙", "price": "人均30元"}
        ],
        "tags": ["三峡", "历史文化", "诗词", "游船"],
        "location": {"lat": 31.017, "lng": 109.464}
    },
    {
        "id": 10,
        "name": "解放碑夜景美食之旅",
        "type": "food",
        "duration": "1day",
        "distance": "5公里",
        "rating": 4.7,
        "reviews": 245,
        "description": "夜游解放碑，品尝地道夜市小吃",
        "image": "/images/jiefangbei-night.jpg",
        "highlights": ["解放碑夜景", "八一好吃街", "较场口夜市"],
        "food": ["烧烤", "串串", "冰粉", "凉虾"],
        "spots": [
            {"name": "解放碑步行街", "time": "1-2小时", "ticket": "免费"},
            {"name": "八一好吃街", "time": "2小时", "ticket": "免费"},
            {"name": "较场口夜市", "time": "2小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "好又来酸辣粉", "type": "酸辣粉", "price": "人均10元"},
            {"name": "山城小汤圆", "type": "小汤圆", "price": "人均8元"}
        ],
        "tags": ["夜景", "夜市", "小吃", "市区"],
        "location": {"lat": 29.557, "lng": 106.580}
    }
]

@app.route('/')
def index():
    return jsonify({
        "message": "重庆周边游API服务",
        "version": "1.0.0",
        "total_routes": len(ROUTES_DATA),
        "endpoints": [
            "/api/routes",
            "/api/routes/<id>",
            "/api/routes/random",
            "/api/categories",
            "/api/health"
        ]
    })

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': '服务正常运行'})

@app.route('/api/routes', methods=['GET'])
def get_routes():
    """获取路线列表，支持筛选"""
    # 获取筛选参数
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    route_type = request.args.get('type', 'all')
    duration = request.args.get('duration', 'all')
    limit = request.args.get('limit', 10, type=int)
    
    routes = ROUTES_DATA.copy()
    
    # 按类型筛选
    if route_type and route_type != 'all':
        routes = [r for r in routes if r['type'] == route_type]
    
    # 按时长筛选
    if duration and duration != 'all':
        routes = [r for r in routes if r['duration'] == duration]
    
    # 如果提供了位置，按距离排序（模拟）
    if lat and lon:
        # 这里可以集成实际的地理距离计算
        # 目前按评分排序
        routes = sorted(routes, key=lambda x: x['rating'], reverse=True)
    
    # 限制返回数量
    routes = routes[:limit]
    
    return jsonify({
        "routes": routes,
        "total": len(routes),
        "filters": {
            "type": route_type,
            "duration": duration,
            "location": {"lat": lat, "lon": lon} if lat and lon else None
        }
    })

@app.route('/api/routes/<int:route_id>', methods=['GET'])
def get_route(route_id):
    """获取单个路线详情"""
    route = next((r for r in ROUTES_DATA if r['id'] == route_id), None)
    if route:
        return jsonify(route)
    return jsonify({'error': '路线不存在'}), 404

@app.route('/api/routes/random', methods=['GET'])
def get_random_route():
    """获取随机路线推荐"""
    count = request.args.get('count', 3, type=int)
    count = min(count, len(ROUTES_DATA))
    
    random_routes = random.sample(ROUTES_DATA, count)
    return jsonify({
        "routes": random_routes,
        "count": count
    })

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """获取路线分类"""
    categories = [
        {"id": "all", "name": "全部", "icon": "🗺️", "count": len(ROUTES_DATA)},
        {"id": "food", "name": "美食优先", "icon": "🍽️", "count": len([r for r in ROUTES_DATA if r['type'] == 'food'])},
        {"id": "hiking", "name": "徒步路线", "icon": "🥾", "count": len([r for r in ROUTES_DATA if r['type'] == 'hiking'])},
        {"id": "scenic", "name": "景区优先", "icon": "🏞️", "count": len([r for r in ROUTES_DATA if r['type'] == 'scenic'])}
    ]
    return jsonify(categories)

@app.route('/api/search', methods=['GET'])
def search_routes():
    """搜索路线"""
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])
    
    results = [r for r in ROUTES_DATA if 
               query in r['name'].lower() or
               query in r['description'].lower() or
               any(query in tag.lower() for tag in r['tags']) or
               any(query in food.lower() for food in r['food'])]
    
    return jsonify({
        "results": results,
        "total": len(results),
        "query": query
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """获取统计信息"""
    # 按类型统计
    type_stats = {}
    for route in ROUTES_DATA:
        route_type = route['type']
        type_stats[route_type] = type_stats.get(route_type, 0) + 1
    
    # 按时长统计
    duration_stats = {}
    for route in ROUTES_DATA:
        duration = route['duration']
        duration_stats[duration] = duration_stats.get(duration, 0) + 1
    
    # 按评分统计
    rating_stats = {
        "excellent": len([r for r in ROUTES_DATA if r['rating'] >= 4.7]),
        "good": len([r for r in ROUTES_DATA if 4.3 <= r['rating'] < 4.7]),
        "average": len([r for r in ROUTES_DATA if r['rating'] < 4.3])
    }
    
    return jsonify({
        "total_routes": len(ROUTES_DATA),
        "total_reviews": sum(r['reviews'] for r in ROUTES_DATA),
        "average_rating": round(sum(r['rating'] for r in ROUTES_DATA) / len(ROUTES_DATA), 2),
        "type_stats": type_stats,
        "duration_stats": duration_stats,
        "rating_stats": rating_stats
    })

if __name__ == '__main__':
    print(f"加载重庆周边游路线数据: {len(ROUTES_DATA)}条路线")
    app.run(host='0.0.0.0', port=9091, debug=True)