const PROXY_CONFIG = {

  "/langsц": {
    "target": "http://127.0.0.1:8081",
    "secure": false
  },
    "bypass": function (req, res, proxyOptions) {
        console.log('/langs -> ', req.headers.host);
    },
    "changeOrigin": true,
    "logLevel": "debug"

};

module.exports = PROXY_CONFIG;
