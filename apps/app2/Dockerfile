FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter app2 build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY apps/app2/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/app2/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
