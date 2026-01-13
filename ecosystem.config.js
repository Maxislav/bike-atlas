module.exports = {
  apps : [{
    name: "bike-atlas",
    script: "./server/index.js",
    //  полный путь к нужной версии node
    interpreter: "/root/.nvm/versions/node/v12.22.12/bin/node",
    env: {
      NODE_ENV: "production",
    }
  }]
}