const express = require("express");
const redis = require('redis');

const app = express();
const client = redis.createClient({
    url: 'redis://@redis-server:6379'
});

console.log("Waiting for redis to start...");

client.on("error", function (error) {
    console.error(error);
});
  
client.on('connect', () => {
    console.log('Redis client connected');
});

client.connect();


app.get("/reset", async (req, res) => {
    const q = req.params.q;
    await client.flushAll();
    res.send("Cache flushed");

});

app.get("/keys", async (req, res) => {

    keys = await client.keys('*');
    res.send(keys);
});

app.get("/set", async (req, res) => {
    let key = req.query.key;
    let value = req.query.value;

    client.set(key , value, function(err, reply) {
        console.log(reply);
    });
    
    res.send("Cached", key, value);
});


app.listen(3000, '0.0.0.0', () => {
    console.log(`SERVER RUN AT http://localhost:${3000}`);
});

