#!/bin/bash
# Docker 部署脚本 - 支持单独拉取容器选择
set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Docker 部署管理脚本${NC}"
echo "================================"

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装，请先安装 Docker${NC}"
        exit 1
    fi
}

# 检查 Docker Compose 是否安装
check_docker_compose() {
    if ! command -v docker compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose 未安装，请先安装 Docker Compose${NC}"
        exit 1
    fi
}

# 获取所有服务列表
get_services() {
    if [ -f "docker-compose.yml" ] || [ -f "compose.yml" ]; then
        docker compose config --services 2>/dev/null || echo ""
    else
        echo ""
    fi
}

# 显示服务选择菜单
show_service_menu() {
    local services=($1)
    echo -e "${YELLOW}📋 可用的服务：${NC}"
    echo "0) 全部服务"
    for i in "${!services[@]}"; do
        echo "$((i+1))) ${services[$i]}"
    done
    echo "q) 退出"
}

# 拉取指定服务的镜像
pull_services() {
    local selected_services=("$@")
    
    if [ ${#selected_services[@]} -eq 0 ]; then
        echo -e "${BLUE}📥 拉取所有服务的 Docker 镜像...${NC}"
        docker compose pull
    else
        echo -e "${BLUE}📥 拉取选定服务的 Docker 镜像...${NC}"
        for service in "${selected_services[@]}"; do
            echo -e "${YELLOW}拉取服务: $service${NC}"
            docker compose pull "$service"
        done
    fi
}

# 启动服务
start_services() {
    local selected_services=("$@")
    
    if [ ${#selected_services[@]} -eq 0 ]; then
        echo -e "${BLUE}🔄 启动所有 Docker 容器...${NC}"
        docker compose up -d
    else
        echo -e "${BLUE}🔄 启动选定的 Docker 容器...${NC}"
        docker compose up -d "${selected_services[@]}"
    fi
}

# 显示容器状态
show_status() {
    # 等待一段时间让容器完全启动
    echo -e "${YELLOW}⏳ 等待容器启动...${NC}"
    sleep 5

    # 检查容器状态
    echo -e "${BLUE}📊 检查容器运行状态：${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

    # 显示详细的容器信息
    echo ""
    echo -e "${BLUE}📋 详细容器信息：${NC}"
    docker compose ps

    # 显示容器日志（最近10行）
    echo ""
    echo -e "${BLUE}📝 最近日志：${NC}"
    docker compose logs --tail=10
}

# 主菜单
show_main_menu() {
    echo ""
    echo -e "${YELLOW}请选择操作：${NC}"
    echo "1) 完整部署（拉取+启动所有服务）"
    echo "2) 选择性拉取镜像"
    echo "3) 选择性启动服务"
    echo "4) 只拉取所有镜像"
    echo "5) 只启动所有服务"
    echo "6) 查看服务状态"
    echo "7) 停止所有服务"
    echo "q) 退出"
}

# 主函数
main() {
    # 检查依赖
    check_docker
    check_docker_compose
    
    # 获取服务列表
    services_list=$(get_services)
    if [ -z "$services_list" ]; then
        echo -e "${RED}❌ 未找到 docker-compose.yml 或 compose.yml 文件${NC}"
        exit 1
    fi
    
    IFS=$'\n' read -rd '' -a services_array <<< "$services_list" || true
    
    while true; do
        show_main_menu
        read -p "请输入选项: " choice
        
        case $choice in
            1)
                echo -e "${GREEN}开始完整部署...${NC}"
                pull_services
                start_services
                show_status
                echo -e "${GREEN}✅ 完整部署完成！${NC}"
                ;;
            2)
                echo -e "${BLUE}选择性拉取镜像${NC}"
                show_service_menu "${services_array[*]}"
                read -p "请输入服务编号(用空格分隔多个选项): " service_choices
                
                selected_services=()
                for choice_num in $service_choices; do
                    if [[ "$choice_num" == "0" ]]; then
                        selected_services=()
                        break
                    elif [[ "$choice_num" =~ ^[1-9][0-9]*$ ]] && [ "$choice_num" -le "${#services_array[@]}" ]; then
                        selected_services+=("${services_array[$((choice_num-1))]}")
                    fi
                done
                
                pull_services "${selected_services[@]}"
                echo -e "${GREEN}✅ 镜像拉取完成！${NC}"
                ;;
            3)
                echo -e "${BLUE}选择性启动服务${NC}"
                show_service_menu "${services_array[*]}"
                read -p "请输入服务编号(用空格分隔多个选项): " service_choices
                
                selected_services=()
                for choice_num in $service_choices; do
                    if [[ "$choice_num" == "0" ]]; then
                        selected_services=()
                        break
                    elif [[ "$choice_num" =~ ^[1-9][0-9]*$ ]] && [ "$choice_num" -le "${#services_array[@]}" ]; then
                        selected_services+=("${services_array[$((choice_num-1))]}")
                    fi
                done
                
                start_services "${selected_services[@]}"
                show_status
                echo -e "${GREEN}✅ 服务启动完成！${NC}"
                ;;
            4)
                pull_services
                echo -e "${GREEN}✅ 所有镜像拉取完成！${NC}"
                ;;
            5)
                start_services
                show_status
                echo -e "${GREEN}✅ 所有服务启动完成！${NC}"
                ;;
            6)
                show_status
                ;;
            7)
                echo -e "${YELLOW}🛑 停止所有服务...${NC}"
                docker compose down
                echo -e "${GREEN}✅ 所有服务已停止！${NC}"
                ;;
            q|Q)
                echo -e "${GREEN}👋 退出脚本${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ 无效选项，请重新选择${NC}"
                ;;
        esac
        
        echo ""
        read -p "按回车键继续..." -r
    done
}

# 如果脚本被直接执行（不是被source），则运行主函数
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

echo ""
echo -e "${BLUE}💡 提示：${NC}"
echo "• 查看完整日志：docker compose logs -f [service_name]"
echo "• 停止特定服务：docker compose stop [service_name]"
echo "• 重启特定服务：docker compose restart [service_name]"
echo "• 查看服务状态：docker compose ps"