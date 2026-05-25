#!/bin/bash

# 重庆周边游启动脚本

echo "🏙️ 重庆周边游启动脚本"
echo "========================"

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到Python3"
    exit 1
fi

# 检查依赖
echo "📦 检查依赖..."
cd server
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "⚠️  未找到requirements.txt，跳过依赖安装"
fi

# 启动后端服务
echo "🚀 启动后端API服务..."
python3 app.py &
BACKEND_PID=$!

# 等待服务启动
sleep 2

# 检查服务是否启动成功
if curl -s http://localhost:9091/api/health > /dev/null; then
    echo "✅ 后端服务启动成功"
    echo "   API地址: http://localhost:9091"
    echo "   API文档: http://localhost:9091"
else
    echo "❌ 后端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "📋 下一步:"
echo "   1. 使用微信开发者工具打开项目"
echo "   2. 导入miniprogram目录"
echo "   3. 配置AppID（测试可使用wxAppId）"
echo "   4. 点击编译运行"
echo ""
echo "📁 项目结构:"
echo "   - miniprogram/  # 小程序前端"
echo "   - server/       # Flask后端"
echo "   - start.sh      # 启动脚本"
echo ""
echo "🛑 停止服务: kill $BACKEND_PID"

# 保持脚本运行
wait $BACKEND_PID