import Redis from "ioredis";

const redis = new Redis()

redis.on("connect", () => {
    console.log("Connected to Redis successfully");
});

redis.on("error", () => {
    console.error("Error connecting to Redis:")
});


export default redis;

