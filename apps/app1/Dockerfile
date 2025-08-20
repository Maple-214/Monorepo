FROM nginx:alpine

COPY ./dist /usr/share/nginx/html/mf/app1/1.0.0/
COPY ../../nginx.remote.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
