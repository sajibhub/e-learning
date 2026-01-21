import { createClient } from 'redis';

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
});

client.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});


const redisConnection = async () => {
    try {
        if (!client.isOpen) {
            await client.connect();
        }
        console.log('✅ Redis client connected successfully');
    } catch (error) {
        console.log("❌ Failed to connect to Redis:", error.message);
    }
}
export { redisConnection, client };