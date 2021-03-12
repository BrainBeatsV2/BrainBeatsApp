# BrainBeatsV2
Welcome to Brain Beats V2

## Usage

### Development
```
docker build -t brain-beats-app .
docker run -p 3000:3000 brain-beats-app
```
Runs on port 3000 and within terminal. 

### Production
```
docker build -t brain-beats-app .
docker run -p 80:3000 -d brain-beats-app
```
Runs on port 80 and in background. 

### Node (deprecated)
```
git clone https://github.com/BrainBeatsV2/BrainBeats_0.1/
cd BrainBeats_0.1
npm init
npm install
npm start
```
