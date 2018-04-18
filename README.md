# Bike-Atlas

![](https://github.com/Maxislav/bike-atlas/blob/master/ScreenShot.png?raw=true=400x200)


#### [Bike-Atlas http://maxislav.github.io/bike-atlas](http://maxislav.github.io/bike-atlas/ "Bike-Atlas")

***

## Required
MySql, Node

## Install
```
~$ npm i
```



## DataBase create

create file server/mysql.config.json
```json
{
  "mysql": {
    "host": "localhost",
    "user": "root",
    "password": "******",
    "timezone":"utc"
  }
}
```
## 1. command for tables create
```bash
~$ node server/mysql-start-up.js
```

## 2. compile, debug and build
```
npm start
```

## 3. launching..
```bash
~$ node server/index.js
```