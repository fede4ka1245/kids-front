FROM node:18

ARG PORT

RUN npm install -g http-server
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
ENV NODE_ENV production

EXPOSE ${PORT}
CMD [ "npx", "http-server", "dist" ]
