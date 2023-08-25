FROM node:18

ARG PORT

RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY . .

EXPOSE ${PORT}
CMD [ "http-server", "dist" ]
