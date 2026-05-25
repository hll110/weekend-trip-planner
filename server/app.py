from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import random

app = Flask(__name__)
CORS(app)

# 路线数据
ROUTES_DATA = [
    {
        "id": 1,
        "name": "北京经典一日游",
        "type": "scenic",
        "duration": "1day",
        "distance": "25公里",
        "rating": 4.8,
        "reviews": 128,
        "description": "探索北京经典景点，感受古都文化",
        "image": "/images/route1.jpg",
        "highlights": ["故宫", "天安门广场", "景山公园"],
        "food": ["北京烤鸭", "炸酱面", "豆汁儿"],
        "spots": [
            {"name": "故宫博物院", "time": "2-3小时", "ticket": "60元"},
            {"name": "天安门广场", "time": "1小时", "ticket": "免费"},
            {"name": "景山公园", "time": "1小时", "ticket": "2元"}
        ],
        "foodSpots": [
            {"name": "全聚德烤鸭店", "type": "北京烤鸭", "price": "人均150元"},
            {"name": "老北京炸酱面馆", "type": "炸酱面", "price": "人均30元"}
        ],
        "tags": ["文化", "历史", "经典"],
        "location": {"lat": 39.915, "lng": 116.397}
    },
    {
        "id": 2,
        "name": "胡同美食探索之旅",
        "type": "food",
        "duration": "1day",
        "distance": "8公里",
        "rating": 4.6,
        "reviews": 89,
        "description": "深入北京胡同，品尝地道小吃",
        "image": "/images/route2.jpg",
        "highlights": ["南锣鼓巷", "烟袋斜街", "什刹海"],
        "food": ["卤煮火烧", "炒肝", "糖葫芦"],
        "spots": [
            {"name": "南锣鼓巷", "time": "2小时", "ticket": "免费"},
            {"name": "烟袋斜街", "time": "1小时", "ticket": "免费"},
            {"name": "什刹海", "time": "2小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "姚记炒肝店", "type": "炒肝", "price": "人均20元"},
            {"name": "卤煮火烧店", "type": "卤煮火烧", "price": "人均25元"}
        ],
        "tags": ["美食", "胡同", "小吃"],
        "location": {"lat": 39.937, "lng": 116.403}
    },
    {
        "id": 3,
        "name": "长城徒步一日游",
        "type": "hiking",
        "duration": "1day",
        "distance": "60公里",
        "rating": 4.9,
        "reviews": 256,
        "description": "攀登长城，感受历史的厚重",
        "image": "/images/route3.jpg",
        "highlights": ["慕田峪长城", "箭扣长城"],
        "food": ["农家菜", "山野菜"],
        "spots": [
            {"name": "慕田峪长城", "time": "4-5小时", "ticket": "40元"},
            {"name": "箭扣长城", "time": "3-4小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "长城脚下农家院", "type": "农家菜", "price": "人均60元"}
        ],
        "tags": ["徒步", "长城", "户外"],
        "location": {"lat": 40.431, "lng": 116.570}
    },
    {
        "id": 4,
        "name": "京郊两日休闲游",
        "type": "scenic",
        "duration": "2day",
        "distance": "120公里",
        "rating": 4.7,
        "reviews": 67,
        "description": "逃离城市喧嚣，享受京郊宁静",
        "image": "/images/route4.jpg",
        "highlights": ["古北水镇", "司马台长城", "密云水库"],
        "food": ["水库鱼", "农家菜", "豆腐宴"],
        "spots": [
            {"name": "古北水镇", "time": "4-5小时", "ticket": "140元"},
            {"name": "司马台长城", "time": "2-3小时", "ticket": "40元"},
            {"name": "密云水库", "time": "2小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "古北水镇餐厅", "type": "特色菜", "price": "人均80元"},
            {"name": "水库鱼馆", "type": "水库鱼", "price": "人均100元"}
        ],
        "tags": ["两日游", "休闲", "京郊"],
        "location": {"lat": 40.658, "lng": 117.266}
    },
    {
        "id": 5,
        "name": "奥林匹克公园徒步",
        "type": "hiking",
        "duration": "1day",
        "distance": "15公里",
        "rating": 4.5,
        "reviews": 45,
        "description": "现代建筑与自然景观的完美结合",
        "image": "/images/route5.jpg",
        "highlights": ["鸟巢", "水立方", "奥林匹克森林公园"],
        "food": ["园区餐厅", "快餐"],
        "spots": [
            {"name": "鸟巢", "time": "1-2小时", "ticket": "50元"},
            {"name": "水立方", "time": "1小时", "ticket": "30元"},
            {"name": "奥林匹克森林公园", "time": "2-3小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "鸟巢餐厅", "type": "快餐", "price": "人均40元"}
        ],
        "tags": ["现代", "公园", "休闲"],
        "location": {"lat": 39.993, "lng": 116.396}
    },
    {
        "id": 6,
        "name": "上海外滩夜景游",
        "type": "scenic",
        "duration": "1day",
        "distance": "10公里",
        "rating": 4.7,
        "reviews": 189,
        "description": "欣赏外滩夜景，感受上海魅力",
        "image": "/images/route6.jpg",
        "highlights": ["外滩", "南京路", "陆家嘴"],
        "food": ["生煎包", "小笼包"],
        "spots": [
            {"name": "外滩", "time": "2小时", "ticket": "免费"},
            {"name": "南京路步行街", "time": "2小时", "ticket": "免费"},
            {"name": "陆家嘴", "time": "1小时", "ticket": "免费"}
        ],
        "foodSpots": [
            {"name": "南翔馒头店", "type": "小笼包", "price": "人均50元"}
        ],
        "tags": ["夜景", "城市", "经典"],
        "location": {"lat": 31.235, "lng": 121.490}
    }
]

@app.route('/')
def index():
    return jsonify({
        "message": "周边游助手API服务",
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
    print(f"加载路线数据: {len(ROUTES_DATA)}条路线")
    app.run(host='0.0.0.0', port=9091, debug=True)