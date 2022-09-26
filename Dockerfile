FROM node:16-alpine
WORKDIR /home/node/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
