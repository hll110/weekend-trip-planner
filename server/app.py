from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import random
from datetime import datetime
from extensions_data import DISTRICTS, SEASONS, FESTIVALS, MONTH_WEATHER, get_season

app = Flask(__name__)
CORS(app)

# 数据文件路径
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'routes_data.json')

def load_routes_data():
    """从JSON文件加载路线数据"""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            routes = json.load(f)
            print(f"加载路线数据: {len(routes)}条")
            return routes
    except FileNotFoundError:
        print(f"警告: 数据文件 {DATA_FILE} 不存在，使用默认数据")
        return get_default_routes()
    except Exception as e:
        print(f"警告: 加载数据文件失败: {e}，使用默认数据")
        return get_default_routes()

def get_default_routes():
    """返回默认路线数据（如果文件加载失败）"""
    return [
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
        }
    ]

# 加载路线数据
ROUTES_DATA = load_routes_data()

@app.route('/')
def index():
    return jsonify({
        "message": "渝趣周边游API服务",
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
    district = request.args.get('district', 'all')
    season = request.args.get('season', 'all')
    festival = request.args.get('festival', 'all')
    limit = request.args.get('limit', 50, type=int)
    
    routes = ROUTES_DATA.copy()
    
    if route_type and route_type != 'all':
        routes = [r for r in routes if r.get('type') == route_type]
    if duration and duration != 'all':
        routes = [r for r in routes if r.get('duration') == duration]
    if district and district != 'all':
        routes = [r for r in routes if r.get('district') == district]
    if season and season != 'all':
        routes = [r for r in routes if season in r.get('seasons', [])]
    if festival and festival != 'all':
        routes = [r for r in routes if festival in r.get('festivals', [])]
    
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
            "district": district,
            "season": season,
            "festival": festival,
            "location": {"lat": lat, "lon": lon} if lat and lon else None
        }
    })


@app.route('/api/weather', methods=['GET'])
def get_weather():
    """重庆出行天气（按月模拟）"""
    month = request.args.get('month', datetime.now().month, type=int)
    profile = MONTH_WEATHER.get(month) or MONTH_WEATHER[4]
    season = get_season(month)
    return jsonify({
        "city": "重庆",
        "month": month,
        "season": season,
        "temp": profile["temp"],
        "description": profile["desc"],
        "humidity": profile["humidity"],
        "icon": profile["icon"],
        "travelTip": profile["tip"]
    })


@app.route('/api/extensions', methods=['GET'])
def get_extensions():
    """扩展内容：区县、季节、节日等"""
    return jsonify({
        "districts": DISTRICTS,
        "seasons": SEASONS,
        "festivals": FESTIVALS
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
    print(f"渝趣周边游API服务启动")
    print(f"加载路线数据: {len(ROUTES_DATA)}条")
    app.run(host='0.0.0.0', port=9091, debug=True)