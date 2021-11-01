FROM node:14
WORKDIR /usr/src/app

COPY package*.json ./

RUN apt update
RUN apt install python3 -y
RUN apt install python3-pip -y

RUN npm install
RUN npm update

# Bundle app source
COPY . .

RUN pip3 install -r requirements.txt

RUN npm install -g serve
RUN npm run build

