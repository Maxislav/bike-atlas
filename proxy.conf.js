const PROXY_CONFIG = [
    {
        "context": ["/langs"],
        "target": "http://127.0.0.1:8081",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug",
        "bypass": function (req, res, proxyOptions) {
            // Логируем хост в консоль терминала
            console.log('Proxying /langs -> ', req.headers.host);
            // Если вы хотите просто логировать и продолжать проксирование,
            // функция не должна ничего возвращать (undefined).
        }
    }
];

module.exports = PROXY_CONFIG;