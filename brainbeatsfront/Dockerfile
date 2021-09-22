FROM node:14
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# RUN npm install -g serve
RUN npm run build
