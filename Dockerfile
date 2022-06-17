FROM nginx:latest

ENV adress="localhost"
ENV port="8080"
ENV RABBITMQ_HOST="rabbitmq"
ENV RABBITMQ_PORT="5672"

COPY src/ /usr/share/nginx/html

EXPOSE 80