const express = require("express");
const redis = require("redis");

const appPort = process.env.PORT || 3000

const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = process.env.REDIS_PORT || 6379
const redisDB = process.env.REDIS_DB || undefined

const app = express();

app.get("/", async (req, res) => {
    const client = redis.createClient({
        host: redisHost,
        port: redisPort,
        db: redisDB,
    });

    client.on('error', function (err) {
        res.status(500).send({message: err.message});
    });

    client.keys('*', function (err, keys) {
        let result = [];

        for (let i = 0, len = keys.length; i < len; i++) {
            result.push(keys[i]);
        }

        res.status(200).send(result.join("\n"));
    });
});

app.listen(appPort, () => {
    console.log("Node server started");
});

