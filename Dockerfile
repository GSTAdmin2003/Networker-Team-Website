# Static site -- no build step. nginx serves the files as-is; TLS and the
# public hostname are handled by the CRM's Caddy on the same box (see
# docker-compose.yml).
FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html index_en.html index_ru.html style.css script.js /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
EXPOSE 80
