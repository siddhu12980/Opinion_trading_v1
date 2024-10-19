import { createClient, RedisClientType } from 'redis';

class RedisPubSubManager {
  private static _instance: RedisPubSubManager | null = null;
  private subClient: RedisClientType;
  private pubClient: RedisClientType;

  private constructor() {
    console.log('RedisPubSubManager created');
    this.subClient = createClient();
    this.pubClient = createClient();
    this.subClient.on('error', (err) => console.error('Redis Subscriber Error', err));
    this.pubClient.on('error', (err) => console.error('Redis Publisher Error', err));
  }

  public static getInstance(): RedisPubSubManager {
    if (!RedisPubSubManager._instance) {
      RedisPubSubManager._instance = new RedisPubSubManager();
    }
    return RedisPubSubManager._instance;

  }
  async ensureRedisConnection() {
    try {
      if (!this.subClient.isOpen) {
        console.log("Connecting sub client to Redis...");
        await this.subClient.connect();
      }
      if (!this.pubClient.isOpen) {
        console.log("Connecting pub client to Redis...");
        await this.pubClient.connect();
      }

    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  sendMessage = async (roomId: string, message: string) => {
    await this.ensureRedisConnection();
    console.log("Sending Message PUB")
    await this.pubClient.publish(roomId, (message));
    console.log("after publish")
  }

  listenForMessages = async (roomId: string, callback: (message: string) => void) => {
    await this.ensureRedisConnection();
    await this.subClient.subscribe(roomId, (message) => {
      console.log(`Room ${roomId} received message: ${JSON.parse(message)}`);
      const data = JSON.parse(message)
      callback(data);
    });
  }

  disconnect = async () => {
    console.log('Disconnecting from Redis...');
    if (this.pubClient.isOpen) {
      await this.pubClient.quit();
    }
    if (this.subClient.isOpen) {
      await this.subClient.quit();
    }
    console.log('Disconnected from Redis');
  }
}

export const redisPubSubManager = RedisPubSubManager.getInstance();
