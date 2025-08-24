#!/bin/bash
set -e

echo "🚀 开始初始化服务器环境..."

# 1. 更新系统
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. 安装必要工具
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 3. 添加 Docker 官方 GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. 添加 Docker 官方源
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. 安装 Docker 和 Compose
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 6. 启动并设置开机启动
sudo systemctl enable docker
sudo systemctl start docker

# 7. 配置 Docker 镜像加速器
sudo mkdir -p /etc/docker
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://registry.docker-cn.com",
    "https://mirror.iscas.ac.cn",
    "https://ccr.ccs.tencentyun.com"
  ]
}
EOF

# 8. 重启 Docker
sudo systemctl daemon-reexec
sudo systemctl restart docker

echo "✅ Docker 安装完成并配置加速器成功"

# 9. 验证
docker --version
docker compose version
