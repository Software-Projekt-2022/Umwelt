FROM node:alpine

ENV adress="localhost"
ENV port="8080"
ENV RABBITMQ_HOST="rabbitmq"
ENV RABBITMQ_PORT="5672"

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm", "start"]