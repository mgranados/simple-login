const { createServer } = require("https");
const { parse } = require("url");
const path = require("path");
const next = require("next");
const fs = require("fs");
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync(path.resolve("./ptestaffing.local+5-key.pem")),
    cert: fs.readFileSync(path.resolve("./ptestaffing.local+5.pem"))
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log("ready - started server on url: https://local.ptestaffing.com:" + port);
    });
});