# BrainBeatsV2
Welcome to Brain Beats V2

## Usage

### Setup
```
sudo apt install docker
sudo apt install docker-compose
```

### Docker
```
git clone https://github.com/BrainBeatsV2/BrainBeatsApp/
cd BrainBeatsApp
docker-compose build
docker-compose up -d
```
Runs on port 3000 and in background. 
Terminate by:
```
docker-compose down
```

Faster docker build & run for testing:
```
docker-compose up --build --force-recreate --renew-anon-volumes --remove-orphans
```

### Electron App
Get into the brainbeatsfront folder by `cd brainbeatsfront`, run `npm update` then run 
```
npm run electron-dev
```

### Mac OS
```
git clone https://github.com/BrainBeatsV2/BrainBeatsApp/
cd BrainBeatsApp
brew install --cask docker
Launch Docker
cd brainbeatsfront/
npm start
```

### MongoDB

Open the Docker Desktop app, click on brainbeatsapp, scroll over the db container and click the CLI button (it looks like ">-"). Inside the Docker CLI, paste the command below to log in as an authenticated user and see data in the database. After that you will be in the mongo CLI!
```
mongo --port 27017 -u "root" -p "toor" --authenticationDatabase "admin"
```

### Development on Windows
Credit: https://www.hostinger.com/tutorials/how-to-set-up-nginx-reverse-proxy/

1. Install nginx
```
sudo apt-get update
sudo apt-get install nginx
```

2. Disable virtual host: 
```
sudo unlink /etc/nginx/sites-enabled/default
```

3. Create the Nginx Reverse Proxy 
```
cd etc/nginx/sites-available/
```

4. Update the config file 
```
server {
    listen 8001;
    server_name localhost;
    location / {
        proxy_pass http://localhost:3000;
    }
    location /api/ {
        proxy_pass http://localhost:4000;
    }
}
```

5. Activate the directives by linking to /sites-enabled/ using the following command:
```
sudo ln -s /etc/nginx/sites-available/reverse-proxy.conf /etc/nginx/sites-enabled/reverse-proxy.conf
```

6. Test Nginx and the Nginx Reverse Proxy
```
sudo service nginx configtest
sudo service nginx restart
```

7. Look at the database entries: 
```
http://localhost:4000/api/users
```

