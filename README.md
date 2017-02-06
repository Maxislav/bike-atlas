# Atlas-Angular2

![](https://github.com/Maxislav/bike-atlas/blob/master/ScreenShot.png?raw=true=400x200)

## Required
MySql, Node

## Install
```
~$ npm i
```

## compile
```
~$ tsc && gulp
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
command for tables create
```bash
~$ node server/mysql-start-up.js
```
## start
```bash
~$ node server/index.js
```