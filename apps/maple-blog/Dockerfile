# 阶段1: 构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --filter maple-blog build

# 阶段2: 运行
FROM nginx:alpine
# 根据您的结构，nginx.conf 可能在 apps/maple-blog/dockerconfigs/ 或 web/dockerconfigs/
COPY apps/maple-blog/dockerconfigs/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/maple-blog/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]