# BrainBeatsV2
Welcome to Brain Beats V2

## Usage

### Docker - development
```
docker build -t brain-beats-app .
docker run -p 3000:3000 brain-beats-app
```

### Docker - production
```
docker build -t brain-beats-app .
docker run -p 80:3000 -d brain-beats-app
```

### Node - deprecated
```
git clone https://github.com/BrainBeatsV2/BrainBeats_0.1/
cd BrainBeats_0.1
npm init
npm install
npm start
```
Visit http://localhost:3000/ !
