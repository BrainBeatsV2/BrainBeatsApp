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


### MongoDB

Open the Docker Desktop app, click on brainbeatsapp, scroll over the db container and click the CLI button (it looks like ">-"). Inside the Docker CLI, paste the command below to log in as an authenticated user and see data in the database. After that you will be in the mongo CLI!
```
mongo --port 27017 -u "root" -p "toor" --authenticationDatabase "admin"
```
