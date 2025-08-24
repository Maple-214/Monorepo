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

# 7. 验证版本
docker --version
docker compose version

# 8. 登录阿里云镜像仓库（需要你传入账号和密码）
# 替换 <username> 和 <password>，或者在脚本执行前导出环境变量
if [ -n "$ALIYUN_USER" ] && [ -n "$ALIYUN_PASS" ]; then
  echo "🔑 使用环境变量登录阿里云 ACR..."
  echo "$ALIYUN_PASS" | docker login --username="$ALIYUN_USER" --password-stdin crpi-x3f046xkcyg3q9cl.cn-hangzhou.personal.cr.aliyuncs.com
else
  echo "⚠️ 请手动运行以下命令完成 ACR 登录："
  echo "docker login --username=maple_214 crpi-x3f046xkcyg3q9cl.cn-hangzhou.personal.cr.aliyuncs.com"
fi
