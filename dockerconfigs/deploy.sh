#!/bin/bash

# Docker 部署脚本
set -e  # 遇到错误立即退出

echo "🚀 开始部署 Docker 容器..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 拉取最新的镜像
echo "📥 拉取最新的 Docker 镜像..."
docker compose pull

# 启动容器（后台运行）
echo "🔄 启动 Docker 容器..."
docker compose up -d

# 等待一段时间让容器完全启动
echo "⏳ 等待容器启动..."
sleep 5

# 检查容器状态
echo "📊 检查容器运行状态："
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 显示详细的容器信息
echo ""
echo "📋 详细容器信息："
docker compose ps

# 显示容器日志（最近10行）
echo ""
echo "📝 最近日志："
docker compose logs --tail=10

echo ""
echo "✅ 部署完成！"
echo "💡 使用以下命令查看完整日志：docker compose logs -f"
echo "💡 使用以下命令停止服务：docker compose down"