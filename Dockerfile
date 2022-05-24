FROM nginx:latest

COPY Frontend/src/ /usr/share/nginx/html

EXPOSE 80