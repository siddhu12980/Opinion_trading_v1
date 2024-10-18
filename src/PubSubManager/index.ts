import { createClient } from "redis"

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;

export async function createConnectRedis(): Promise<void> {
  const client = await createClient();

  await client.connect();

  if (client.isOpen) {
    redisClient = client;
  }
}


export async function reconnectRedis(): Promise<void> {
  if (!redisClient || !redisClient.isOpen) {
    console.log('Redis client is not open, reconnecting...');
    await createConnectRedis();
  } else {
    console.log('Redis client is already open.');
  }
}
export { redisClient };
