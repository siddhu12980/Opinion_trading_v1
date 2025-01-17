import { createClient, RedisClientType } from "redis";

export class RedisManager {
  private static instance: RedisManager | null = null;
  private client: RedisClientType | null = null;

  private constructor() {}

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public async connect(): Promise<void> {
    if (this.client?.isOpen) {
      console.log("Redis client is already connected.");
      return;
    }

    try {
      const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
      this.client = createClient({ url: redisUrl });

      this.client.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });

      await this.client.connect();
      console.log("Redis client connected successfully.");
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  public async reconnect(): Promise<void> {
    if (!this.client || !this.client.isOpen) {
      console.log("Redis client is not open, reconnecting...");
      await this.connect();
    } else {
      console.log("Redis client is already connected.");
    }
  }

  public getClient(): RedisClientType {
    if (!this.client) {
      throw new Error("Redis client not initialized. Call connect() first.");
    }
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
      console.log("Redis client disconnected.");
    }
  }
}

export const getRedisClient = (): RedisClientType => {
  return RedisManager.getInstance().getClient();
};

export const initializeRedis = async (): Promise<void> => {
  await RedisManager.getInstance().connect();
};
