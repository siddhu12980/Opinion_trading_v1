import { WebSocketServer, WebSocket } from 'ws';
import { redisPubSubManager } from "./pubsubmanager/manager"
const stockSubscriptions: Map<string, Set<WebSocket>> = new Map();
const subscribedStocks: Set<string> = new Set();

export async function startWebSocketServer(port: number) {

  const wss = new WebSocketServer({ port }, () => {
    console.log(`WebSocket server is listening on port ${port}`);
  });

  const broadcastToSubscribers = (stockSymbol: string, message: any) => {
    const clients = stockSubscriptions.get(stockSymbol);
    if (clients) {
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ stockSymbol, message }));
        }
        ;
      }
      )
    };
  }

  const setupRedisListener = async (stockSymbol: string) => {
    if (!subscribedStocks.has(stockSymbol)) {
      subscribedStocks.add(stockSymbol);
      await redisPubSubManager.listenForMessages(stockSymbol, (message) => {
        broadcastToSubscribers(stockSymbol, message);
      });
      console.log(` Redis listener for stock: ${stockSymbol}`);
    }
  };

  const subscribeClientToStock = (ws: WebSocket, stockSymbol: string) => {
    if (!stockSubscriptions.has(stockSymbol)) {
      stockSubscriptions.set(stockSymbol, new Set());
    }
    stockSubscriptions.get(stockSymbol)!.add(ws);
    console.log(`Client subscribed to stock: ${stockSymbol}`);
  };

  const unsubscribeClientFromStock = async (ws: WebSocket, stockSymbol: string) => {
    const clients = stockSubscriptions.get(stockSymbol);
    if (clients) {
      clients.delete(ws);
      console.log(`Client unsubscribed from stock: ${stockSymbol}`);
      if (clients.size === 0) {
        stockSubscriptions.delete(stockSymbol);
        subscribedStocks.delete(stockSymbol);
        await redisPubSubManager.unsubscribeUser(stockSymbol);
        console.log(`No more clients subscribed to stock: ${stockSymbol}, unsubscribed from Redis`);
      }
    }
  };

  const cleanupClientSubscriptions = async (ws: WebSocket) => {
    for (const [stockSymbol, clients] of stockSubscriptions.entries()) {
      if (clients.has(ws)) {
        await unsubscribeClientFromStock(ws, stockSymbol);
      }
    }
  };

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', async (data: string) => {
      try {
        const parsedData = JSON.parse(data);
        const { stockSymbol, action } = parsedData;

        if (stockSymbol && action === "subscribe") {
          console.log("Client Subscribed to ", stockSymbol)
          await setupRedisListener(stockSymbol);
          subscribeClientToStock(ws, stockSymbol);
        } else if (stockSymbol && action === "unsubscribe") {
          await unsubscribeClientFromStock(ws, stockSymbol);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    ws.on('close', () => {
      cleanupClientSubscriptions(ws);
    });
  });

  await redisPubSubManager.ensureRedisConnection();

  process.on('SIGINT', async () => {
    console.log('Shutting down WebSocket server...');
    await redisPubSubManager.disconnect();
    wss.close(() => {
      console.log('WebSocket server closed');
      process.exit(0);
    });
  });
}

startWebSocketServer(8080).then(() => console.log("WS Server Started"))
