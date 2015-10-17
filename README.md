# GTFS Editor

## Video demo
- [Stoptimes](https://vimeo.com/99912288)
- [Routes](https://vimeo.com/99912286)
- [Stops map](https://vimeo.com/99912285)
- [Stops](https://vimeo.com/99912287)


## Requirements
- Homebrew (http://brew.sh/)
- Node.js (http://nodejs.org/)
- MongoDB (http://www.mongodb.org/)

## How to install & run

### 1. Install Homebrew
[Go to Homebrew website](http://brew.sh/)

### 2. Install MongoDB
Run in a Terminal/Console:
- brew update
- brew install mongodb
- mkdir -p /data/db
- Set permissions for the data directory (ensure that the user account running mongod has read and write permissions for the directory)

[Or follow the steps here](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

### 3. Install Node.js
[Go to NodeJs website for instructions](https://nodejs.org/en/)

## How to Run

### 1. Create database
Run in a terminal:
- mongo (to start the database)
- use gtfsdb (to create/switch to database)
- (optional) use the mongod command to watch the mongo activity

### 2. Prepare application - Update dependencies
- npm install
- npm install -g bower (if you don't have bower installed)
- bower install or bower update (if you already have bower installed)

### 3. Run application
- npm start
- Go to http://localhost:3000

#### (Optional) Automatic reload and restart server
- Install nodemon: `npm install -g nodemon`
- Run nodemon: `nodemon bin/www`
