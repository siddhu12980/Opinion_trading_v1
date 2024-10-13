import { createClient } from "redis";

async function createConnection() {
  console.log("connecting to Redis")
  const client = await createClient();

  if (!client.isOpen) {
    console.log("Reconnecting")
    await client.connect()
  }

  return client;

}

export default createConnection
