# 阶段1: 构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter web build

# 阶段2: 运行
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
