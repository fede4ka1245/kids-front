FROM node:lts-alpine

ARG PORT

RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE ${PORT}
CMD [ "http-server", "dist" ]
