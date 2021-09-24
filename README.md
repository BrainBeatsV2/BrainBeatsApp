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
Unsupported platform for dmg-license@1.0.9: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
```

### Electron App
Get into the brainbeatsfront folder by `cd brainbeatsfront`, run `npm update` then run 
```
npm run electron-dev
```

### MongoDB

Open the Docker Desktop app, click on brainbeatsapp, scroll over the db container and click the CLI button (it looks like ">-"). Inside the Docker CLI, paste the command below to log in as an authenticated user and see data in the database. After that you will be in the mongo CLI!
```
mongo --port 27017 -u "root" -p "toor" --authenticationDatabase "admin"
```
