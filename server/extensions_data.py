# 扩展数据（与 miniprogram/data/extensions.js 保持一致）

DISTRICTS = [
    {"id": "all", "name": "全部区县"},
    {"id": "yuzhong", "name": "渝中区"},
    {"id": "jiangbei", "name": "江北区"},
    {"id": "nanan", "name": "南岸区"},
    {"id": "shapingba", "name": "沙坪坝区"},
    {"id": "wulong", "name": "武隆区"},
    {"id": "dazu", "name": "大足区"},
    {"id": "youyang", "name": "酉阳县"},
    {"id": "fengjie", "name": "奉节县"},
    {"id": "nanchuan", "name": "南川区"},
    {"id": "wanzhou", "name": "万州区"},
]

SEASONS = [
    {"id": "all", "name": "全季", "icon": "🗓️"},
    {"id": "spring", "name": "春季", "icon": "🌸"},
    {"id": "summer", "name": "夏季", "icon": "☀️"},
    {"id": "autumn", "name": "秋季", "icon": "🍂"},
    {"id": "winter", "name": "冬季", "icon": "❄️"},
]

FESTIVALS = [
    {"id": "hotpot", "name": "重庆火锅文化节", "period": "10月", "district": "渝中区"},
    {"id": "duanwu", "name": "端午龙舟赛", "period": "农历五月", "district": "涪陵区"},
    {"id": "chunjie", "name": "春节庙会", "period": "农历正月", "district": "沙坪坝区"},
]

MONTH_WEATHER = {
    1: {"temp": 8, "desc": "阴冷有雾", "humidity": 85, "icon": "🌫️", "tip": "备羽绒服，注意防滑"},
    4: {"temp": 22, "desc": "温和多云", "humidity": 70, "icon": "⛅", "tip": "磁器口、桃花源最佳"},
    7: {"temp": 32, "desc": "高温酷暑", "humidity": 75, "icon": "☀️", "tip": "室内博物馆，夜游两江"},
    10: {"temp": 20, "desc": "凉爽宜人", "humidity": 70, "icon": "🍁", "tip": "火锅节、国庆灯光秀"},
}

def get_season(month):
    if 3 <= month <= 5:
        return "spring"
    if 6 <= month <= 8:
        return "summer"
    if 9 <= month <= 11:
        return "autumn"
    return "winter"
