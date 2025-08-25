# 阶段1: 构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter app1 build

# 阶段2: 运行
FROM nginx:alpine
COPY apps/app1/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/app1/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
