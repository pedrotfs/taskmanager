FROM node:12

#app dir
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "src/index.js" ]