import Redis from 'ioredis';

const redis = new Redis({
  port: Number(process.env.REDIS_PORT) || 6379,
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_AUTH || '',
  maxRetriesPerRequest: 3,
});

redis
  .on('error', (err) => {
    console.log('Redis connection error: ', err);
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      redis.disconnect();
      return;
    }
  })
  .on('connect', () => {
    console.log('Redis connected!');
  });

export default redis;
