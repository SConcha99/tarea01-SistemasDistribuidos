const redis = require('redis');

const client = redis.createClient({
    url: 'redis://@redis-server:6379'
}
);

console.log("Waiting for redis to start...");

client.on("error", function (error) {
    console.error(error);
});
  
client.on('connect', () => {
    console.log('Redis client connected');
});
client.connect();