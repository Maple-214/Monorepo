```bash
# 更新系统
sudo apt-get update

# 安装依赖
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 添加 Docker 官方 GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 添加 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 更新并安装 Docker + Compose 插件
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin



#验证安装
docker --version
# 输出类似：Docker version 27.0.3, build xxxx

docker compose version
# 注意：新版命令是 docker compose 而不是 docker-compose
# 输出类似：Docker Compose version v2.29.1

#后续更新
cd ~/myapp-deploy
docker compose pull
docker compose up -d
docker ps
```
